export class GitHubContainerRegistry {
  public static url = 'ghcr.io'
  public static user = 'covik'
  public static password = process.env.CLUSTER_CONTAINER_REGISTRY_TOKEN || ''
}
