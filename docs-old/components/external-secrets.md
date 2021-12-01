### External Secrets Operator

- namespace: grassroots
- docs: https://external-secrets.io

#### Setup and configuration

External Secrets Operator is responsible for syncing secrets from Vault.

**1. Defining Vault SecretStore**

```yaml
apiVersion: external-secrets.io/v1alpha1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: grassroots
spec:
  provider:
    vault:
      server: "http://vault:8200"
      # vault.md step 2
      path: "kv"
      version: "v2"
      auth:
        # vault.md step 3
        kubernetes:
          mountPath: "kubernetes"
          # vault.md step 5
          role: "apps"
          #  init-resources.yaml
          serviceAccountRef:
            name: "vault-auth"
            namespace: grassroots
```

**2. Creating a sample secret**

It is important to understand the concept of creating secrets from the docs provided above before proceeding.

_This will pull the secret created in `vault.md`_

```yaml
apiVersion: external-secrets.io/v1alpha1
kind: ExternalSecret
metadata:
  name: test-secret
  namespace: grassroots
spec:
  refreshInterval: "10s"
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    # This is the name of the actual Kubernetes secret created, deployments should point to this
    name: my-test-secret
  data:
    - secretKey: username
      remoteRef:
        key: apps/helloworld
        property: username
    - secretKey: password
      remoteRef:
        key: apps/helloworld
        property: password
```
