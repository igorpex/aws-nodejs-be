-- create database lesson4;

create extension if not exists "uuid-ossp";

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	imageurl text,
	price integer
);

create table stocks (
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
);


insert into products (id, title, description, imageurl, price) values
('1f9fa292-0b77-4881-9fa4-b265b5dfa87d', 'Nice Black Dog', 'Henry is a great dog and I’m so sad to let him go, but I’m moving overseas and won’t be able to take him with me.', 'https://picsum.photos/id/237/300/200' , 520),
('fa311480-6408-439b-96cb-27d9b502dcd0', 'Flying car', 'The Flying Ford Anglia was used on 3 August 1992 by Fred, George, and Ron Weasley to rescue Harry Potter, who was locked up in his room at the Dursleys', 'https://picsum.photos/id/1071/300/200', 2900),
('1d614461-2985-45a3-8476-603dd87bc656', 'Old Bicycle', 'This is a thing to drive all day then you are young.','https://picsum.photos/id/146/300/200' , 15),
('2a27d07c-f6e7-42b1-8f82-2005c286afb5', 'My School Mac', 'The MacBook is a brand of Macintosh laptop computers designed and marketed by Apple Inc.', 'https://picsum.photos/id/119/300/200', 315),
('26b9848e-8436-4725-96be-1e70435690c2', 'Kind Cat', 'The cat loves to play and catch mice', 'https://c.wallhere.com/photos/15/4f/2560x1600_px_brick_cat_red_wall-1909581.jpg!s', 190),
('904e8e59-8ea3-45f3-931d-fd5faadb4b18', 'Scooter', 'It rolls cool, very fun. Used to play scooter polo.', 'https://cdn1.riastatic.com/photosnew/general/adv_photos/children-goods-samokat-micro-rocket-goluboy__102281036b.jpg', 101),
('89ce63b7-5e71-4dd8-b4a7-8df5fe71ef93', 'Broomstick', 'Nice speedy stable broomstick. Almost new. Sold due to upgrading to newer model.', 'https://static.turbosquid.com/Preview/2015/11/25__13_03_50/Broom.jpgbafea61d-4912-4487-b575-415aeb9974c8Res300.jpg', 100),
('5c182924-3914-4e73-94f5-7f3826b6d7fd', 'Magic wand', 'Powerful magic tool. Can make strong spells. Really good.', 'https://media.nauticamilanonline.com/product/varita-magica-harry-potter-hechizos-800x800.jpg', 1200),
('0661b093-6095-4b0c-8f88-afbec7293477', 'Glasses', 'My glasses. No need anymore, now I can see well.', 'https://i5.walmartimages.com/asr/0e4ad746-ba16-4da5-8434-f7ef2a92a242_1.2ea6df67360131a23007f323713e06e9.jpeg', 20),
('5821995e-0ed4-4aa5-9735-f8357c2ae2dd', 'Snitch', 'Fast golden snitch. It took a lot of efforts to get it. Take it!', 'https://quizshow.online/aa/wp-content/uploads/2018/11/1449352178150683822.jpg', 200)



insert into stocks (product_id, count) values
('1f9fa292-0b77-4881-9fa4-b265b5dfa87d', 1),
('fa311480-6408-439b-96cb-27d9b502dcd0', 2),
('1d614461-2985-45a3-8476-603dd87bc656', 5),
('2a27d07c-f6e7-42b1-8f82-2005c286afb5', 3),
('26b9848e-8436-4725-96be-1e70435690c2', 3),
('904e8e59-8ea3-45f3-931d-fd5faadb4b18', 2),
('89ce63b7-5e71-4dd8-b4a7-8df5fe71ef93', 5),
('5c182924-3914-4e73-94f5-7f3826b6d7fd', 10),
('0661b093-6095-4b0c-8f88-afbec7293477', 2),
('5821995e-0ed4-4aa5-9735-f8357c2ae2dd', 4)


-- Insert new value
--insert into products (title, description, imageurl , price) values ('Soccer ball', 'Nice Soccer ball', 'https://img.freepik.com/free-vector/soccer-ball-realistic-white-black-picture_1284-8506.jpg', 100) returning id;
--insert into stocks (product_id, count) values ('cd2d45bd-509d-44a3-b899-2a8c216d4316', 20);

--delete new value (change ID to real)
--delete from stocks where product_id = 'cd2d45bd-509d-44a3-b899-2a8c216d4316'
--delete from products where id = 'cd2d45bd-509d-44a3-b899-2a8c216d4316'

Drop tables
--DROP table stocks
--DROP table products

