### Storj S3

- docs: https://docs.storj.io

#### Setup

1. Create the following buckets from the dashboard:

- pgwal
- pglogical

2. Create an access grant with Download, Upload and List permissions
3. Get S3 credentials

#### Configuration values

##### General config

- endpoint: https://gateway.eu1.storjshare.io
- region: leave blank or ""
- bucket_name: bucket name created in step 1
- access_key_id: from storj ui
- secret_access_key: from storj ui

##### [s3-cli](https://github.com/koblas/s3-cli)

- ~/.s3cfg

```toml
[default]
access_key = from_storj_ui
host_base = gateway.eu1.storjshare.io
secret_key = from_storj_ui
```
