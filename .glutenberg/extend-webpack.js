const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = ( webpackConfig ) => {
	webpackConfig.module.rules.forEach( rule => {
		if ( rule.exclude ) {
			rule.exclude.push( /\.scss$/ );
		}
	} );

	webpackConfig.module.rules.push( {
		test: /\.scss$/,
		use: [
			{ loader: 'style-loader' },
			{ loader: 'css-loader' },
			{
				loader: 'sass-loader',
				query: {
					includePaths: [ path.resolve( __dirname, '../editor/assets/stylesheets' ) ],
					data: '@import "variables"; @import "mixins"; @import "animations";@import "z-index";',
					outputStyle: 'production' === process.env.NODE_ENV ?
						'compressed' : 'nested',
				},
			},
		],
	} );
};
