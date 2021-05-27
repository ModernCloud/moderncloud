CREATE TABLE IF NOT EXISTS `user` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    stripe_customer_id VARCHAR(40) DEFAULT NULL,
    current_subscription_id VARCHAR(40) DEFAULT NULL,
    current_subscription_status VARCHAR(30) DEFAULT NULL,
    UNIQUE INDEX email_uniq (email),
    UNIQUE INDEX stripe_customer_idx (stripe_customer_id),
    UNIQUE INDEX current_subscription_idx (current_subscription_id),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `project` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL,
    INDEX user_idx (user_id),
    UNIQUE name_uniq (user_id, name),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `package` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    file_id BIGINT UNSIGNED DEFAULT NULL,
    file_type VARCHAR(20) DEFAULT NULL,
    runtime VARCHAR(50) DEFAULT NULL,
    name VARCHAR(50) NOT NULL,
    version VARCHAR(10) NOT NULL,
    INDEX project_idx (project_id),
    INDEX file_idx (file_id, file_type),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `function` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT DEFAULT NULL,
    main_file VARCHAR(50) NOT NULL,
    handler VARCHAR(50) NOT NULL,
    runtime VARCHAR(50) NOT NULL,
    code MEDIUMTEXT NOT NULL,
    memory_size INT default 128,
    timeout INT DEFAULT 3,
    UNIQUE name_uniq (project_id, name),
    INDEX project_idx (project_id),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `endpoint` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(50) DEFAULT NULL,
    main_file VARCHAR(50) NOT NULL,
    handler VARCHAR(50) NOT NULL,
    runtime VARCHAR(50) NOT NULL,
    code MEDIUMTEXT NOT NULL,
    method VARCHAR(50) NOT NULL,
    path VARCHAR(255) NOT NULL,
    memory_size INT default 128,
    timeout INT DEFAULT 3,
    INDEX project_idx (project_id),
    UNIQUE path_uniq (project_id, method, path),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `dynamodb` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL,
    read_capacity INT DEFAULT 1,
    write_capacity INT DEFAULT 1,
    hash_key VARCHAR(30) NOT NULL,
    range_key VARCHAR(30) DEFAULT NULL,
    attributes JSON DEFAULT NULL,
    INDEX project_idx (project_id),
    UNIQUE path_uniq (project_id, name),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `environment` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL,
    region VARCHAR(50) DEFAULT NULL,
    access_key VARCHAR(255) DEFAULT NULL,
    secret_key VARCHAR(255) DEFAULT NULL,
    domain_name VARCHAR(255) DEFAULT NULL,
    certificate_arn VARCHAR(255) DEFAULT NULL,
    validation_options JSON DEFAULT NULL,
    api_gateway_id VARCHAR(255) DEFAULT NULL,
    api_gateway_url VARCHAR(255) DEFAULT NULL,
    api_gateway_arn VARCHAR(255) DEFAULT NULL,
    cloudfront_domain_name VARCHAR(255) DEFAULT NULL,
    terraform_s3_bucket VARCHAR(255) DEFAULT NULL,
    output JSON DEFAULT NULL,
    UNIQUE name_uniq (project_id, name),
    INDEX project_idx (project_id),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `environment_variable` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    environment_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL,
    value VARCHAR(50) DEFAULT NULL,
    UNIQUE name_uniq (environment_id, name),
    INDEX project_idx (project_id),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `task` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED AS (params->>'$.user_id'),
    project_id BIGINT UNSIGNED AS (params->>'$.project_id'),
    environment_id BIGINT UNSIGNED AS (params->>'$.environment_id'),
    name VARCHAR(50) NOT NULL,
    params JSON NOT NULL,
    current_status INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX project_id (user_id, project_id),
    INDEX environment_idx (user_id, environment_id),
    INDEX updated_at_idx (updated_at desc),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `task_log` (
    task_id BIGINT UNSIGNED NOT NULL,
    detail TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    INDEX task_idx (task_id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `python_package` (
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    INDEX name_idx (name),
    UNIQUE KEY version_uniq(name, version)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;