package com.topdesk.topgrocery.cloudstorage;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.WritableByteChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import org.springframework.core.io.support.PropertiesLoaderUtils;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

public class CloudShitStorage {
	public static void syncDatabase() {
		try {
			Properties props = PropertiesLoaderUtils.loadAllProperties("application.properties");
			String bucketName = props.getProperty("gcp.bucket.name");
			String databaseFileName = props.getProperty("database.file.name");
			Storage storage = StorageOptions.getDefaultInstance().getService();
			BlobId blobId = BlobId.of(bucketName, databaseFileName);
			Blob blob = storage.get(blobId);
			Path target = Paths.get("./" + databaseFileName);
			byte[] data = Files.readAllBytes(target);
			if (blob == null) {
				BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
				storage.create(blobInfo, data);
			}
			else {
				WritableByteChannel channel = blob.writer();
				channel.write(ByteBuffer.wrap(data));
				channel.close();
			}
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}
}
