class Projects::ReleasesController < Projects::ApplicationController
  # Authorize
  before_action :require_non_empty_project
  before_action :authorize_download_code!
  before_action :authorize_push_code!
  before_action :tag
  before_action :release

  def show
  end

  def edit
  end

  def update
    description = params[:release][:description]
    release.update_attributes(description: description)
    release.save

    redirect_to namespace_project_tag_release_path(@project.namespace, @project, @tag.name)
  end

  private

  def tag
    @tag ||= @repository.find_tag(params[:tag_id])
  end

  def release
    @release ||= @project.releases.find_or_initialize_by(tag: @tag.name)
  end
end
