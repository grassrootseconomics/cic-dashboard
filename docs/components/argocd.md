### Argo Workflows

- namespace: argocd
- endpoint: argocd.domain
- docs: https://argo-cd.readthedocs.io/en/stable/

ArgoCD is responsible keeping the cluster in sync with the repo which acts as a source of truth. Any direct change to the cluster (bypassing the git repo) will trigger ArgoCD to self-heal the cluster.

#### Configuration and Setup

1. Login into the UI with the dumped password
2. Settings > Repositories > Add repo
3. Add this repo with a read_only token (the HTTPS url should end with .git)
4. Create a new app with auto-sync and self-heal enabled for each of the following directories in the repo (ArgoCD will automatically detect deployment type):
   - grassroots-manifests
5. Enable webhook push events to ArgoCD (optional) - `https://argocd.domain/api/webhook`
