<script>
import { GlButtonGroup, GlDropdown, GlDropdownItem, GlLink, GlSearchBoxByType } from '@gitlab/ui';
import autofocusonshow from '~/vue_shared/directives/autofocusonshow';
import ReviewAppLink from '../review_app_link.vue';

export default {
  name: 'DeploymentViewButton',
  components: {
    GlButtonGroup,
    GlDropdown,
    GlDropdownItem,
    GlLink,
    GlSearchBoxByType,
    ReviewAppLink,
    VisualReviewAppLink: () =>
      import('ee_component/vue_merge_request_widget/components/visual_review_app_link.vue'),
  },
  directives: {
    autofocusonshow,
  },
  props: {
    appButtonText: {
      type: Object,
      required: true,
    },
    deployment: {
      type: Object,
      required: true,
    },
    showVisualReviewApp: {
      type: Boolean,
      required: false,
      default: false,
    },
    visualReviewAppMeta: {
      type: Object,
      required: false,
      default: () => ({
        sourceProjectId: '',
        sourceProjectPath: '',
        mergeRequestId: '',
        appUrl: '',
      }),
    },
  },
  data() {
    return { searchTerm: '' };
  },
  computed: {
    deploymentExternalUrl() {
      if (this.deployment.changes && this.deployment.changes.length === 1) {
        return this.deployment.changes[0].external_url;
      }
      return this.deployment.external_url;
    },
    shouldRenderDropdown() {
      return this.deployment.changes && this.deployment.changes.length > 1;
    },
    filteredChanges() {
      return this.deployment?.changes?.filter(change => change.path.includes(this.searchTerm));
    },
  },
};
</script>
<template>
  <span>
    <gl-button-group v-if="shouldRenderDropdown" size="small">
      <review-app-link
        :display="appButtonText"
        :link="deploymentExternalUrl"
        size="small"
        css-class="deploy-link js-deploy-url inline"
      />
      <gl-dropdown size="small" class="js-mr-wigdet-deployment-dropdown">
        <gl-search-box-by-type v-model.trim="searchTerm" v-autofocusonshow autofocus />
        <gl-dropdown-item
          v-for="change in filteredChanges"
          :key="change.path"
          class="js-filtered-dropdown-result"
        >
          <gl-link
            :href="change.external_url"
            target="_blank"
            rel="noopener noreferrer nofollow"
            class="js-deploy-url-menu-item menu-item"
          >
            <strong class="str-truncated-100 gl-mb-0 gl-display-block">{{ change.path }}</strong>
            <p class="text-secondary str-truncated-100 gl-mb-0 d-block">
              {{ change.external_url }}
            </p>
          </gl-link>
        </gl-dropdown-item>
      </gl-dropdown>
    </gl-button-group>
    <review-app-link
      v-else
      :display="appButtonText"
      :link="deploymentExternalUrl"
      size="small"
      css-class="js-deploy-url deploy-link btn btn-default btn-sm inline"
    />
    <visual-review-app-link
      v-if="showVisualReviewApp"
      :view-app-display="appButtonText"
      :link="deploymentExternalUrl"
      :app-metadata="visualReviewAppMeta"
      :changes="deployment.changes"
    />
  </span>
</template>
