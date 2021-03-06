package com.gamsung.mapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.gamsung.vo.Product;
import com.gamsung.vo.ProductFile;
import com.gamsung.vo.Review;
import com.gamsung.vo.ReviewFile;

@Mapper
public interface ReviewMapper {

	ArrayList<Review> selectReviewsByProductNo(int productNo);

	void insertReview(Review review);
	
	List<Review> selectReview(String memberId);
	
	void insertProductFile(ProductFile file);
	
//	ReviewFile selectReviewFileByDealNo(int dealNo);
	
	List<ReviewFile> selectReviewFilesByDealNo(int dealNo);

	void insertReviewFile(ReviewFile file);

	void deleteReview(int dealNo);

	void updateReview(Review review);

	Review selectReviewByDealNo(int dealNo);

	void deleteReviewFile(int reviewFileNo);

	/* 상점 */
	List<Review> selectStoreReview(String id);

	//Review selectReviewBuyerImg(String id);

	float selectStoreAvg(String id);
	
}
