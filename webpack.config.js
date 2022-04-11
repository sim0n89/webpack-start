const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () =>{
	const configObj ={
		splitChunks :{
			chunks:'all'
		}
	};

	if (isProd){
		configObj.minimizer = [
			new OptimizeCssAssetWebpackPlugin(),
			new TerserWebpackPlugin()
		];
	}
	return configObj
}

module.exports={
	context:path.resolve(__dirname, 'src'),
	mode:'development',
	entry: './js/main.js',
	output: {
		filename: `./js/${filename('js')}`,
		path: path.resolve(__dirname, 'app'),
		publicPath: ''
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'app'),
		 },
		historyApiFallback: true,
		open:true,
		compress:true,
		hot:true,
		port:3000
	 },
	optimization: optimization(),
	plugins:[
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			filename:'index.html',
			minify:{
				collapseWhitespace: isProd
			}
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: `./css/${filename('css')}`,
		}),
		new CopyWebpackPlugin({
			patterns:[{
				from:path.resolve(__dirname, 'src/assets'),to: path.resolve(__dirname, 'app/assets'),
			}]
		})
	],
	devtool:isProd ? false : 'source-map',
	module: {
		rules: [
			{
				test: /\.html$/i,
        		loader: "html-loader",
			},
		  {
			 test: /\.css$/i,
			 use: [
			 {
				 loader:MiniCssExtractPlugin.loader,
				 options:{
					 hmr:isDev
				 },
				 
			 },
			 "css-loader"
			],
		  },
		  {
			test: /\.s[ac]ss$/i,
			use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {
						publicPath: (resourcePath, context) => {
						  return path.relative(path.dirname(resourcePath), context) + '/';
						},
					 }
				},
				 "css-loader", 
				 'sass-loader'],
		 },
		 {test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
		
		  type: 'asset/resource',
		  generator: {
						filename: (isDev) =>{
							if (isDev){
								return 'static/img/[name][ext][query]';
							}
							return 'static/img/[hash][ext][query]';
						}
					},
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext][query]'
				}
		  },
	// 	  {
	// 		test: /\.js$/,
	// 		exclude:'/node_modules/',
	// 		use:['babel-loader'],
	//   },
		],
	 },
}