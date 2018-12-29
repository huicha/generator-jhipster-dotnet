const mkdirp = require('mkdirp');
const cleanup = require('generator-jhipster/generators/cleanup');
const constants = require('generator-jhipster/generators/generator-constants');
const baseServerFiles = require('generator-jhipster/generators/server/files').serverFiles;
const dotnetConstants = require('../generator-dotnet-constants');

/* Constants use throughout */
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_DOTNET_SRC_DIR = `${constants.MAIN_DIR}dotnet/`;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
const SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const serverFiles = {
    ...baseServerFiles,
    serverBuild: [
        ...baseServerFiles.serverBuild,
        {
            condition: generator => generator.buildTool === 'gradle',
            templates: [{ file: 'gradle/kotlin.gradle', useBluePrint: true }]
        }
    ],
    serverResource: [
        ...baseServerFiles.serverResource,
        {
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'banner.txt',
                    method: 'copy',
                    noEjs: true,
                    renameTo: () => 'banner.txt',
                    useBluePrint: true
                }
            ]
        }
    ],
    serverJavaApp: [
        {
            path: SERVER_MAIN_DOTNET_SRC_DIR,
            templates: [
                {
                    file: 'package/Application.kt',
                    useBluePrint: true,
                    renameTo: generator => `${generator.javaDir}${generator.mainClass}.kt`
                }
            ]
        }
    ],
    serverJavaConfig: [
        {
            path: SERVER_MAIN_DOTNET_SRC_DIR,
            templates: [
                {
                    file: 'package/aop/logging/LoggingAspect.kt',
                    renameTo: generator => `${generator.javaDir}aop/logging/LoggingAspect.kt`,
                    useBluePrint: true
                },
                {
                    file: 'package/config/DefaultProfileUtil.kt',
                    renameTo: generator => `${generator.javaDir}config/DefaultProfileUtil.kt`,
                    useBluePrint: true
                },
                {
                    file: 'package/config/AsyncConfiguration.kt',
                    renameTo: generator => `${generator.javaDir}config/AsyncConfiguration.kt`,
                    useBluePrint: true
                },
                {
                    file: 'package/config/DateTimeFormatConfiguration.kt',
                    renameTo: generator => `${generator.javaDir}config/DateTimeFormatConfiguration.kt`,
                    useBluePrint: true
                },
                {
                    file: 'package/config/LoggingConfiguration.kt',
                    renameTo: generator => `${generator.javaDir}config/LoggingConfiguration.kt`,
                    useBluePrint: true
                },
                {
                    file: 'package/config/ApplicationProperties.kt',
                    renameTo: generator => `${generator.javaDir}config/ApplicationProperties.kt`,
                    useBluePrint: true
                },
                {
                    file: 'package/config/JacksonConfiguration.kt',
                    renameTo: generator => `${generator.javaDir}config/JacksonConfiguration.kt`,
                    useBluePrint: true
                },
                {
                    file: 'package/config/LoggingAspectConfiguration.kt',
                    renameTo: generator => `${generator.javaDir}config/LoggingAspectConfiguration.kt`,
                    useBluePrint: true
                }
            ]
        },
        {
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/Constants.java',
                    renameTo: generator => `${generator.javaDir}config/Constants.java`
                },
                {
                    file: 'package/config/LocaleConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/LocaleConfiguration.java`
                },
                {
                    file: 'package/config/MetricsConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/MetricsConfiguration.java`
                },
                {
                    file: 'package/config/WebConfigurer.java',
                    renameTo: generator => `${generator.javaDir}config/WebConfigurer.java`
                }
            ]
        },
        {
            // TODO: remove when supported by spring-data
            condition: generator => generator.reactive,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/ReactivePageableHandlerMethodArgumentResolver.java',
                    renameTo: generator => `${generator.javaDir}config/ReactivePageableHandlerMethodArgumentResolver.java`
                },
                {
                    file: 'package/config/ReactiveSortHandlerMethodArgumentResolver.java',
                    renameTo: generator => `${generator.javaDir}config/ReactiveSortHandlerMethodArgumentResolver.java`
                }
            ]
        },
        {
            condition: generator =>
                ['ehcache', 'hazelcast', 'infinispan', 'memcached'].includes(generator.cacheProvider) ||
                generator.applicationType === 'gateway',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/CacheConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/CacheConfiguration.java`
                }
            ]
        },
        {
            condition: generator => generator.cacheProvider === 'infinispan',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/CacheFactoryConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/CacheFactoryConfiguration.java`
                }
            ]
        },
        {
            condition: generator =>
                generator.databaseType === 'sql' || generator.databaseType === 'mongodb' || generator.databaseType === 'couchbase',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/CloudDatabaseConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/CloudDatabaseConfiguration.java`
                },
                {
                    file: 'package/config/DatabaseConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/DatabaseConfiguration.java`
                },
                {
                    file: 'package/config/audit/package-info.java',
                    renameTo: generator => `${generator.javaDir}config/audit/package-info.java`
                },
                {
                    file: 'package/config/audit/AuditEventConverter.java',
                    renameTo: generator => `${generator.javaDir}config/audit/AuditEventConverter.java`
                }
            ]
        },
        {
            condition: generator => generator.databaseType === 'sql',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/LiquibaseConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/LiquibaseConfiguration.java`
                }
            ]
        },
        {
            condition: generator => generator.databaseType === 'couchbase',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/repository/N1qlCouchbaseRepository.java',
                    renameTo: generator => `${generator.javaDir}repository/N1qlCouchbaseRepository.java`
                },
                {
                    file: 'package/repository/CustomN1qlCouchbaseRepository.java',
                    renameTo: generator => `${generator.javaDir}repository/CustomN1qlCouchbaseRepository.java`
                }
            ]
        },
        {
            condition: generator => generator.websocket === 'spring-websocket',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/WebsocketConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/WebsocketConfiguration.java`
                },
                {
                    file: 'package/config/WebsocketSecurityConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/WebsocketSecurityConfiguration.java`
                }
            ]
        },
        {
            condition: generator => generator.databaseType === 'cassandra',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/metrics/package-info.java',
                    renameTo: generator => `${generator.javaDir}config/metrics/package-info.java`
                },
                {
                    file: 'package/config/metrics/JHipsterHealthIndicatorConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/metrics/JHipsterHealthIndicatorConfiguration.java`
                },
                {
                    file: 'package/config/metrics/CassandraHealthIndicator.java',
                    renameTo: generator => `${generator.javaDir}config/metrics/CassandraHealthIndicator.java`
                }
            ]
        },
        {
            condition: generator => generator.databaseType === 'cassandra',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/cassandra/CassandraConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/cassandra/CassandraConfiguration.java`
                },
                {
                    file: 'package/config/cassandra/package-info.java',
                    renameTo: generator => `${generator.javaDir}config/cassandra/package-info.java`
                }
            ]
        },
        {
            condition: generator => generator.searchEngine === 'elasticsearch',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/ElasticsearchConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/ElasticsearchConfiguration.java`
                }
            ]
        },
        {
            condition: generator => generator.messageBroker === 'kafka',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/MessagingConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/MessagingConfiguration.java`
                }
            ]
        }
    ]
};

function writeFiles() {
    return {
        setUp() {
            this.javaDir = `${this.packageFolder}/`;
            this.testDir = `${this.packageFolder}/`;

            // Create Java resource files
            mkdirp(SERVER_MAIN_RES_DIR);
            mkdirp(`${SERVER_TEST_SRC_DIR}/${this.testDir}`);
            this.generateKeyStore();
        },

        cleanupOldServerFiles() {
            cleanup.cleanupOldServerFiles(
                this,
                `${SERVER_MAIN_SRC_DIR}/${this.javaDir}`,
                `${SERVER_TEST_SRC_DIR}/${this.testDir}`,
                SERVER_MAIN_RES_DIR,
                SERVER_TEST_RES_DIR
            );
        },

        writeFiles() {
            writeFilesToDisk(serverFiles, this, false, this.fetchFromInstalledJHipster('server/templates'));
        },

        modifyFiles() {
            if (this.buildTool === 'gradle') {
                this.addGradlePlugin('org.jetbrains.kotlin', 'kotlin-gradle-plugin', dotnetConstants.DOTNET_VERSION);
                this.addGradlePlugin('org.jetbrains.kotlin', 'kotlin-allopen', dotnetConstants.DOTNET_VERSION);

                this.applyFromGradleScript('gradle/kotlin');
            }
        }
    };
}

/**
 * write the given files using provided config.
 *
 * @param {object} files - files to write
 * @param {object} generator - the generator instance to use
 * @param {boolean} returnFiles - weather to return the generated file list or to write them
 * @param {string} prefix - prefix to add in the path
 */
function writeFilesToDisk(files, generator, returnFiles, prefix) {
    const _this = generator || this;
    const filesOut = [];
    const startTime = new Date();
    // using the fastest method for iterations
    /* eslint-disable */
    for (const block of Object.keys(files)) {
        for (const blockTemplate of files[block]) {
            if (!blockTemplate.condition || blockTemplate.condition(_this)) {
                const path = blockTemplate.path || '';
                for (const templateObj of blockTemplate.templates) {
                    let templatePath = path;
                    let method = 'template';
                    let useTemplate = false;
                    let options = {};
                    let templatePathTo;
                    if (typeof templateObj === 'string') {
                        templatePath += templateObj;
                    } else {
                        if (typeof templateObj.file === 'string') {
                            templatePath += templateObj.file;
                        } else if (typeof templateObj.file === 'function') {
                            templatePath += templateObj.file(_this);
                        }
                        method = templateObj.method ? templateObj.method : method;
                        useTemplate = templateObj.template ? templateObj.template : useTemplate;
                        options = templateObj.options ? templateObj.options : options;
                    }
                    if (templateObj && templateObj.renameTo) {
                        templatePathTo = path + templateObj.renameTo(_this);
                    } else {
                        // remove the .ejs suffix
                        templatePathTo = templatePath.replace('.ejs', '');
                    }
                    filesOut.push(templatePathTo);
                    if (!returnFiles) {
                        let templatePathFrom = prefix ? `${prefix}/${templatePath}` : templatePath;

                        if (templateObj.useBluePrint) {
                            templatePathFrom = templatePath;
                        }
                        if (
                            !templateObj.noEjs &&
                            !templatePathFrom.endsWith('.png') &&
                            !templatePathFrom.endsWith('.jpg') &&
                            !templatePathFrom.endsWith('.gif') &&
                            !templatePathFrom.endsWith('.svg') &&
                            !templatePathFrom.endsWith('.ico')
                        ) {
                            templatePathFrom = `${templatePathFrom}.ejs`;
                        }
                        // if (method === 'template')
                        _this[method](templatePathFrom, templatePathTo, _this, options, useTemplate);
                    }
                }
            }
        }
    }
    _this.debug(`Time taken to write files: ${new Date() - startTime}ms`);
    return filesOut;
}

module.exports = {
    writeFiles,
    serverFiles
};
