CREATE TABLE IF NOT EXISTS `user` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE INDEX email_uniq (email),
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
    name VARCHAR(50) NOT NULL,
    version VARCHAR(10) NOT NULL,
    UNIQUE name_uniq (project_id, name),
    INDEX project_idx (project_id),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `function` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL,
    main_file VARCHAR(50) NOT NULL,
    handler VARCHAR(50) NOT NULL,
    runtime VARCHAR(50) NOT NULL,
    code MEDIUMTEXT NOT NULL,
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
    main_file VARCHAR(50) NOT NULL,
    handler VARCHAR(50) NOT NULL,
    runtime VARCHAR(50) NOT NULL,
    code MEDIUMTEXT NOT NULL,
    method VARCHAR(50) NOT NULL,
    path VARCHAR(255) NOT NULL,
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

CREATE TABLE IF NOT EXISTS `deployment` (
    id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    environment_id BIGINT UNSIGNED NOT NULL,
    output JSON DEFAULT NULL,
    current_status INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX project_idx (project_id),
    INDEX updated_at_idx (updated_at desc),
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `deployment_log` (
    deployment_id BIGINT UNSIGNED NOT NULL,
    detail TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    INDEX deployment_idx (deployment_id)
) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;