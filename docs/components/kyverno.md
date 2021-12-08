Kyverno is pod policy controller. The following policies are enforced:

- Image registry source
- Non latest tags

```yaml
# Pull images from Private registry only
---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: restrict-image-registry
  namespace: secure
  annotations:
    policies.kyverno.io/title: Restrict To DOCR
    policies.kyverno.io/category: Best Practices
    policies.kyverno.io/severity: medium
    policies.kyverno.io/subject: Pod
spec:
  validationFailureAction: enforce
  background: true
  rules:
    - name: validate-registries
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Image not from Grassecon registry"
        pattern:
          spec:
            containers:
              - image: "docker.grassecon.net/cic-stack/*"
---
# Disallow latest tag
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-latest-tag
  annotations:
    policies.kyverno.io/title: Disallow Latest Tag
    policies.kyverno.io/category: Best Practices
    policies.kyverno.io/severity: medium
    policies.kyverno.io/subject: Pod
spec:
  validationFailureAction: enforce
  background: true
  rules:
    - name: require-image-tag
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "An image tag is required."
        pattern:
          spec:
            containers:
              - image: "*:*"
    - name: validate-image-tag
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Using a mutable image tag e.g. 'latest' is not allowed."
        pattern:
          spec:
            containers:
              - image: "!*:latest"
```
