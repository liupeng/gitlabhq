import Visibility from 'visibilityjs';
import axios from 'axios';
import { __ } from '../../../../locale';
import flash from '../../../../flash';
import Poll from '../../../../lib/utils/poll';
import service from '../../../services';
import * as types from './mutation_types';

let eTagPoll;

export const clearEtagPoll = () => (eTagPoll = null);
export const stopPipelinePolling = () => eTagPoll.stop();
export const restartPipelinePolling = () => eTagPoll.restart();

export const requestLatestPipeline = ({ commit }) => commit(types.REQUEST_LATEST_PIPELINE);
export const receiveLatestPipelineError = ({ commit, dispatch }) => {
  flash(__('There was an error loading latest pipeline'));
  commit(types.RECEIVE_LASTEST_PIPELINE_ERROR);
  dispatch('stopPipelinePolling');
};
export const receiveLatestPipelineSuccess = ({ rootGetters, commit }, { pipelines }) => {
  if (pipelines && pipelines.length) {
    const lastCommitHash = rootGetters.lastCommit && rootGetters.lastCommit.id;
    const lastCommitPipeline = pipelines.find(pipeline => pipeline.commit.id === lastCommitHash);

    commit(types.RECEIVE_LASTEST_PIPELINE_SUCCESS, lastCommitPipeline);
  }
};

export const fetchLatestPipeline = ({ dispatch, rootGetters }) => {
  if (eTagPoll) return;

  dispatch('requestLatestPipeline');

  eTagPoll = new Poll({
    resource: service,
    method: 'lastCommitPipelines',
    data: { getters: rootGetters },
    successCallback: ({ data }) => dispatch('receiveLatestPipelineSuccess', data),
    errorCallback: () => dispatch('receiveLatestPipelineError'),
  });

  if (!Visibility.hidden()) {
    eTagPoll.makeRequest();
  }

  Visibility.change(() => {
    if (!Visibility.hidden()) {
      eTagPoll.restart();
    } else {
      eTagPoll.stop();
    }
  });
};

export const requestJobs = ({ commit }, id) => commit(types.REQUEST_JOBS, id);
export const receiveJobsError = ({ commit }, id) => {
  flash(__('There was an error loading jobs'));
  commit(types.RECEIVE_JOBS_ERROR, id);
};
export const receiveJobsSuccess = ({ commit }, { id, data }) =>
  commit(types.RECEIVE_JOBS_SUCCESS, { id, data });

export const fetchJobs = ({ dispatch }, stage) => {
  dispatch('requestJobs', stage.id);

  axios
    .get(stage.dropdown_path)
    .then(({ data }) => dispatch('receiveJobsSuccess', { id: stage.id, data }))
    .catch(() => dispatch('receiveJobsError', stage.id));
};

export default () => {};
