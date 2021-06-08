CREATE TABLE "user"
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);
CREATE UNIQUE INDEX user_email_uniq ON "user"(email);

CREATE TABLE project
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR NOT NULL
);
CREATE INDEX project_user_idx ON project(user_id);
CREATE UNIQUE INDEX project_name_uniq ON project(user_id, name);

CREATE TABLE package
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    file_id BIGINT DEFAULT NULL,
    file_type VARCHAR DEFAULT NULL,
    runtime VARCHAR DEFAULT NULL,
    name VARCHAR NOT NULL,
    version VARCHAR NOT NULL
);
CREATE INDEX package_project_idx ON package(project_id);
CREATE INDEX package_file_idx ON package(file_id, file_type);

CREATE TABLE "function"
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    user_name VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    description TEXT DEFAULT NULL,
    main_file VARCHAR NOT NULL,
    handler VARCHAR NOT NULL,
    runtime VARCHAR NOT NULL,
    code TEXT NOT NULL,
    memory_size SMALLINT DEFAULT 128,
    timeout SMALLINT DEFAULT 3
);
CREATE UNIQUE INDEX function_name_uniq ON "function"(project_id, name);
CREATE INDEX function_project_idx ON "function"(project_id);

CREATE TABLE endpoint
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    user_name VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    description VARCHAR DEFAULT NULL,
    main_file VARCHAR NOT NULL,
    handler VARCHAR NOT NULL,
    runtime VARCHAR NOT NULL,
    code TEXT NOT NULL,
    method VARCHAR NOT NULL,
    path VARCHAR NOT NULL,
    memory_size SMALLINT DEFAULT 128,
    timeout SMALLINT DEFAULT 3
);
CREATE UNIQUE INDEX endpoint_path_uniq ON endpoint (project_id, method, path);
CREATE INDEX endpoint_project_idx ON endpoint (project_id);

CREATE TABLE dynamodb
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    name VARCHAR NOT NULL,
    read_capacity SMALLINT DEFAULT 1,
    write_capacity SMALLINT DEFAULT 1,
    hash_key VARCHAR NOT NULL,
    range_key VARCHAR DEFAULT NULL,
    attributes JSON DEFAULT NULL
);
CREATE UNIQUE INDEX dynamodb_name_uniq ON dynamodb (project_id, name);
CREATE INDEX dynamodb_project_idx ON dynamodb (project_id);

CREATE TABLE environment
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    name VARCHAR NOT NULL,
    region VARCHAR DEFAULT NULL,
    access_key VARCHAR DEFAULT NULL,
    secret_key VARCHAR DEFAULT NULL,
    domain_name VARCHAR DEFAULT NULL,
    certificate_arn VARCHAR DEFAULT NULL,
    validation_options JSON DEFAULT NULL,
    api_gateway_id VARCHAR DEFAULT NULL,
    api_gateway_url VARCHAR DEFAULT NULL,
    api_gateway_arn VARCHAR DEFAULT NULL,
    cloudfront_domain_name VARCHAR DEFAULT NULL,
    terraform_s3_bucket VARCHAR DEFAULT NULL,
    output JSON DEFAULT NULL
);
CREATE UNIQUE INDEX environment_name_uniq ON environment (project_id, name);
CREATE INDEX environment_project_idx ON environment (project_id);

CREATE TABLE environment_variable
(
    id BIGSERIAL NOT NULL PRIMARY KEY ,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    environment_id BIGINT NOT NULL,
    name VARCHAR NOT NULL,
    value VARCHAR DEFAULT NULL
);
CREATE UNIQUE INDEX environment_variable_name_uniq ON environment_variable (environment_id, name);
CREATE INDEX environment_variable_project_idx ON environment_variable (project_id);

CREATE TABLE task
(
    id BIGSERIAL NOT NULL PRIMARY KEY ,
    user_id BIGINT generated always as ((params ->> 'user_id')::bigint) stored,
    project_id BIGINT generated always as ((params ->> 'project_id')::bigint) stored ,
    environment_id BIGINT generated always as ((params ->> 'environment_id')::bigint) stored,
    name VARCHAR NOT NULL,
    params jsonb NOT NULL,
    current_status SMALLINT NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);
CREATE INDEX task_project_idx ON task (user_id, project_id);
CREATE INDEX task_environment_idx ON task (user_id, environment_id);
CREATE INDEX task_updated_idx ON task (updated_at desc);

CREATE TABLE task_log
(
    task_id BIGINT NOT NULL,
    detail TEXT DEFAULT NULL,
    created_at timestamptz NOT NULL
);
CREATE INDEX task_log_task_idx ON task_log (task_id);

CREATE TABLE python_package
(
    name VARCHAR NOT NULL,
    version VARCHAR NOT NULL
);
CREATE UNIQUE INDEX python_package_version_uniq ON python_package (name, version);
CREATE INDEX python_package_name_idx ON python_package (name);