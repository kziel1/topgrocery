package com.topdesk.topgrocery;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ApiRequestService {
	
	@Autowired
	private ApiRequestDao apiRequestDao;
	
	public void create(ApiRequest apiRequest) {
		apiRequestDao.create(apiRequest);
	}
}