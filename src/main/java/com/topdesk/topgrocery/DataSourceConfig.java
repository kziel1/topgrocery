package com.topdesk.topgrocery;

import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import javax.sql.DataSource;

import org.h2.jdbcx.JdbcDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PropertiesLoaderUtils;

@Configuration
public class DataSourceConfig {
	@Bean
	@Primary
	public DataSource createDataSource() {
		JdbcDataSource jdbcDataSource = new JdbcDataSource();
		try {
			Properties props = PropertiesLoaderUtils.loadAllProperties("application.properties");
			String databaseFileName = props.getProperty("database.file.name");
			String databaseUrl = props.getProperty("spring.datasource.url");
			String databaseFileUrl = props.getProperty("gcp.storage.database.file.url");
			jdbcDataSource.setURL(databaseUrl);
			URL url = new URL(databaseFileUrl);
			URLConnection uc = url.openConnection();
			Path target = Paths.get("./" + databaseFileName);
			Files.deleteIfExists(target);
			Files.copy(uc.getInputStream(), target);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return jdbcDataSource;
	}
}
