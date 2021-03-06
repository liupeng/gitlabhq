import { produce } from 'immer';
import submitContentChanges from '../../services/submit_content_changes';
import savedContentMetaQuery from '../queries/saved_content_meta.query.graphql';

const submitContentChangesResolver = (
  _,
  { input: { project: projectId, username, sourcePath, content, images, mergeRequestMeta } },
  { cache },
) => {
  return submitContentChanges({
    projectId,
    username,
    sourcePath,
    content,
    images,
    mergeRequestMeta,
  }).then(savedContentMeta => {
    const data = produce(savedContentMeta, draftState => {
      return {
        savedContentMeta: {
          __typename: 'SavedContentMeta',
          ...draftState,
        },
      };
    });

    cache.writeQuery({
      query: savedContentMetaQuery,
      data,
    });
  });
};

export default submitContentChangesResolver;
