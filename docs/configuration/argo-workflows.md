### Argo Workflows

- namespace: argocd
- endpoint: workflows.domain
- docs: https://argoproj.github.io/argo-workflows/

#### Usage

**Prerequisites:**

- `$KUBECONFIG` is exported and available
- [Argo Workflows CLI](https://github.com/argoproj/argo-workflows/releases) is installed (Linux/Mac)

1. Generate an auth token with `argo auth token` which can be used for logging into the UI
2. Run a workflow ([samples](https://argoproj-labs.github.io/argo-workflows-catalog/))
