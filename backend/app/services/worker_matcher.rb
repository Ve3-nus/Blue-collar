class WorkerMatcher
  def self.match(job)
    WorkerProfile
      .joins(:skills)
      .where(
        skills: {
          name: job.skill_required
        }
      )
      .distinct
  end
end