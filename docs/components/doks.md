### DOKS

- docs: https://docs.digitalocean.com/products/kubernetes/how-to/

#### LoadBalancer

Known gotchas:

- Reusing the load-balancer name or id in a different cluster context will unset disown the loadbalancer from its original cluster and re-attach it to the new one
- To test a new cluster, give the load balancer a new unique name in the `service.beta.kubernetes.io/do-loadbalancer-name: "traefik-lb"` and remove the loadbalancer id
- To re-attach a loadbalancer to a new cluster either destroy the old cluster while keeping the loadbalancer (from DO dashboard) or use the "disown" annotation described in DO docs

