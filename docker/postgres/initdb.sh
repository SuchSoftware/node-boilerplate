#!/bin/bash

# Modified from:
# https://hub.docker.com/_/postgres/
set -e

echo $POSTGRES_USER
echo $POSTGRES_DB

psql -v ON_ERROR_STOP=1 -v VERBOSITY=verbose --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE practical_microservices_test;
  \c practical_microservices_test

  GRANT ALL PRIVILEGES ON DATABASE practical_microservices_test TO practical_microservices;
  ALTER DEFAULT PRIVILEGES FOR ROLE practical_microservices IN SCHEMA PUBLIC GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO practical_microservices;
  ALTER DEFAULT PRIVILEGES FOR ROLE practical_microservices IN SCHEMA PUBLIC GRANT EXECUTE ON FUNCTIONS TO practical_microservices;
EOSQL
