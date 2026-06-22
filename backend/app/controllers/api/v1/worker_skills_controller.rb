class Api::V1::WorkerSkillsController < ApplicationController
  before_action :authorize_request

  def index
    profile = current_user.worker_profile

    render json: profile.skills
  end

  def create
    profile = current_user.worker_profile

    skill = Skill.find(params[:skill_id])

    worker_skill = profile.worker_skills.build(
      skill: skill
    )

    if worker_skill.save
      render json: worker_skill,
             status: :created
    else
      render json: {
        errors: worker_skill.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    worker_skill = WorkerSkill.find(params[:id])

    worker_skill.destroy

    render json: {
      message: "Skill removed successfully"
    }
  end
end