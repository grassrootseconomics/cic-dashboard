### Argo Workflows

- namespace: argocd
- endpoint: workflows.domain
- docs: https://argoproj.github.io/argo-workflows/

#### Usage

1. Generate an auth token with `argo auth token` which can be used for logging into the UI
2. Run a workflow from your local: `argo -n argo submit https://raw.githubusercontent.com/argoproj/argo-workflows/master/examples/coinflip.yaml --watch`
