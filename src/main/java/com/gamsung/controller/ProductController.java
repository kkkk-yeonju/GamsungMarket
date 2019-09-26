package com.gamsung.controller;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.gamsung.service.ProductService;
import com.gamsung.vo.Heart;
import com.gamsung.vo.Product;

@Controller
@RequestMapping(path="product")
public class ProductController {
	
	@Autowired
	private ProductService productService;


	
	@GetMapping(path="detail/{productNo}")
	public String productDetail(@PathVariable int productNo, Model model) {
		
		Product product = productService.findProductByProductNo(productNo);
	     
		model.addAttribute("product", product);
		 
		return "product/detail"; 
	}
	
	@GetMapping(path = "/categories")
	public String productList(Model model) {
		
		ArrayList<Product> products = productService.findProducts();
		
		model.addAttribute("products", products);
		System.out.println(products);
		
		return "product/list"; 
	}
	
	@GetMapping(path = "/write")
	public String showProductWrite() {
		
		return "product/write";
	}	
	
	@PostMapping(path = "/write")
	public String write(Product product, Model model, HttpServletRequest req) {
		Authentication auth = (Authentication)req.getUserPrincipal();
		product.setSeller(auth.getName());
		productService.writeProduct(product);
		model.addAttribute("product", product);
		
		
		
		return "redirect:/product/categories";
	}
	
	//찜하기
	@GetMapping(path = "/addheart")
	//@RequestMapping(path = "/addheart?productNo={productNo}", method = {RequestMethod.POST, RequestMethod.GET})
	@ResponseBody
	public String addToHeart(Heart heart, int productNo, HttpServletRequest req) {
		
		Authentication auth = (Authentication)req.getUserPrincipal();
		
		if(auth != null) {
			heart.setId(auth.getName());
			productService.insertHeart(heart);
			return "success";
		} else { 
			return "redirect:/";
		}

	}

}

