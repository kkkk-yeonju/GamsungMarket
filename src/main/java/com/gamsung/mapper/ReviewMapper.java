package com.gamsung.mapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.gamsung.vo.ProductFile;
import com.gamsung.vo.Review;
import com.gamsung.vo.ReviewFile;

@Mapper
public interface ReviewMapper {

	ArrayList<Review> selectReviewsByProductNo(int productNo);

	void insertReview(Review review);
	
	List<Review> selectReview(String memberId);
	
	void insertProductFile(ProductFile file);
	
	ReviewFile selectReviewFileByProductNo(int productNo);

	void insertReviewFile(ReviewFile file);
	

}
