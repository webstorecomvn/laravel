<?php

use Illuminate\Support\Str;
use Illuminate\Support\Arr;

// _thumbs
if(! function_exists('_thumbs'))
{
    /**
     * @param: string $imgfile
     * @param: string $path
     * @param: string $maxWidth
     * @param: string $maxHeight
     * @param: string $crop
     * @param: array $arr_more
     */
	function _thumbs($imgfile = "", $path = "", $maxWidth = "", $maxHeight = "", $crop = 0, $arr_more = array())
	{
		$info = @getimagesize($imgfile);
		$mime = $info[2];
		$fext = ($mime == 1 ? 'image/gif' : ($mime == 2 ? 'image/jpeg' : ($mime == 3 ? 'image/png' : NULL)));
		switch ($fext) {
			case 'image/jpeg':
				if (!function_exists('imagecreatefromjpeg')) {
					die('No create from JPEG support');
				} else {
					$img['src'] = @imagecreatefromjpeg($imgfile);
				}
				break;
			case 'image/png':
				if (!function_exists('imagecreatefrompng')) {
					die("No create from PNG support");
				} else {
					$img['src'] = @imagecreatefrompng($imgfile);
				}
				break;
			case 'image/gif':
				if (!function_exists('imagecreatefromgif')) {
					die("No create from GIF support");
				} else {
					$img['src'] = @imagecreatefromgif($imgfile);
				}
				break;
		}
		$img['old_w'] = @imagesx($img['src']);
		$img['old_h'] = @imagesy($img['src']);

		if ($crop) {
			// Ratio cropping
			$offsetX = 0;
			$offsetY = 0;

			if (!$maxWidth && $maxHeight) {
				$maxWidth = 99999999999999;
			} elseif ($maxWidth && !$maxHeight) {
				$maxHeight = 99999999999999;
			}

			$cropRatio = explode(':', (string)$crop);
			if (count($cropRatio) == 2) {
				$ratioComputed = $img['old_w'] / $img['old_h'];
				$cropRatioComputed = (float)$cropRatio[0] / (float)$cropRatio[1];

				if ($ratioComputed < $cropRatioComputed) { // Image is too tall so we will crop the top and bottom
					$origHeight = $img['old_h'];
					$img['old_h'] = $img['old_w'] / $cropRatioComputed;
					$offsetY = ($origHeight - $img['old_h']) / 2;
				} else if ($ratioComputed > $cropRatioComputed) { // Image is too wide so we will crop off the left and right sides
					$origWidth = $img['old_w'];
					$img['old_w'] = $img['old_h'] * $cropRatioComputed;
					$offsetX = ($origWidth - $img['old_w']) / 2;
				}
			}

			$xRatio = $maxWidth / $img['old_w'];
			$yRatio = $maxHeight / $img['old_h'];

			if ($xRatio * $yRatio < $maxHeight) { // Resize the image based on width
				$new_h = ceil($xRatio * $img['old_h']);
				$new_w = $maxWidth;
			} else // Resize the image based on height
			{
				$new_w = ceil($yRatio * $img['old_w']);
				$new_h = $maxHeight;
			}

		} else {
			$new_h = $img['old_h'];
			$new_w = $img['old_w'];
			$offsetX = 0;
			$offsetY = 0;

			if(isset($arr_more["fix_width"]) && $arr_more["fix_width"]==1) {
				$new_w = $maxWidth;
				$new_h = ($maxWidth / $img['old_w']) * $img['old_h'];
			} elseif(isset($arr_more["fix_height"]) && $arr_more["fix_height"]== 1) {
				$new_h = $maxHeight;
				$new_w = ($maxHeight / $img['old_h']) * $img['old_w'];
			} elseif(isset($arr_more["fix_min"]) && $arr_more["fix_min"]== 1) {
				if ($img['old_w'] > $img['old_h']) {
					$new_h = $maxHeight;
					$new_w = ($maxHeight / $img['old_h']) * $img['old_w'];

					if ($new_w < $maxWidth) {
						$new_w = $maxWidth;
						$new_h = ($maxWidth / $img['old_w']) * $img['old_h'];
					}
				} else {
					$new_w = $maxWidth;
					$new_h = ($maxWidth / $img['old_w']) * $img['old_h'];

					if ($new_h < $maxHeight) {
						$new_h = $maxHeight;
						$new_w = ($maxHeight / $img['old_h']) * $img['old_w'];
					}
				}
			} elseif(isset($arr_more["fix_max"]) && $arr_more["fix_max"]== 1) {
				if ($maxWidth > 0 && $maxHeight > 0) {
					$tl = $img['old_w'] / $img['old_h'];
					$tl_get = $maxWidth / $maxHeight;

					if ($tl > $tl_get) {
						if ($img['old_w'] > $maxWidth) {
							$new_w = $maxWidth;
							$new_h = ($maxWidth / $img['old_w']) * $img['old_h'];
						}
					} else {
						if ($img['old_h'] > $maxHeight) {
							$new_h = $maxHeight;
							$new_w = ($new_h / $img['old_h']) * $img['old_w'];
						}
					}
				}
			} elseif(isset($arr_more["zoom_max"]) && $arr_more["zoom_max"]== 1) {
				$tl = $img['old_w'] / $img['old_h'];
				$tl_get = $maxWidth / $maxHeight;

				if ($tl_get > $tl) {
					$new_h = $maxHeight;
					$new_w = ($maxHeight / $img['old_h']) * $img['old_w'];
				} else {
					$new_w = $maxWidth;
					$new_h = ($maxWidth / $img['old_w']) * $img['old_h'];
				}
			} else {
				if ($maxWidth && $maxHeight) {
					$new_w = $maxWidth;
					$new_h = $maxHeight;
				} else {
					$new_h = $img['old_h'];
					$new_w = $img['old_w'];
					$offsetX = 0;
					$offsetY = 0;

					if ($img['old_w'] > $maxWidth) {
						$new_w = $maxWidth;
						$new_h = ($maxWidth / $img['old_w']) * $img['old_h'];
					}
					if ($new_h > $maxWidth) {
						$new_h = $maxWidth;
						$new_w = ($new_h / $img['old_h']) * $img['old_w'];
					}
				}
			}
		}

		$img['des'] = @imagecreatetruecolor($new_w, $new_h);
		if ($fext == "image/png") {
			@imagealphablending($img['des'], false);
			@imagesavealpha($img['des'], true);
		} else {
			$white = @imagecolorallocate($img['des'], 255, 255, 255);
			@imagefill($img['des'], 1, 1, $white);
		}
		@imagecopyresampled($img['des'], $img['src'], 0, 0, $offsetX, $offsetY, $new_w, $new_h, $img['old_w'], $img['old_h']);
		//	print "path = ".$path."<br>";
		@touch($path);
		switch ($fext) {
			case 'image/pjpeg':
			case 'image/jpeg':
			case 'image/jpg':
				@imagejpeg($img['des'], $path, 80);
				break;
			case 'image/png':
				@imagepng($img['des'], $path);
				break;
			case 'image/gif':
				@imagegif($img['des'], $path, 80);
				break;
		}
		// Finally, we destroy the images in memory.
		@imagedestroy($img['des']);
	}
}

// _stringify_attributes
if(! function_exists('_stringify_attributes'))
{
	/**
	 * Stringify attributes for use in HTML tags.
	 *
	 * Helper function used to convert a string, array, or object
	 * of attributes to a string.
	 *
	 * @param	mixed	string, array, object
	 * @param	bool
	 * @return	string
	 */
	function _stringify_attributes($attributes, $js = FALSE)
	{
		$atts = NULL;

		if(empty($attributes)) {
			return $atts;
		}

		if(is_string($attributes)) {
			return ' '.$attributes;
		}

		$attributes = (array) $attributes;

		foreach ($attributes as $key => $val) {
			$atts .= ($js) ? $key.'='.$val.',' : ' '.$key.'="'.$val.'"';
		}

		return rtrim($atts, ',');
	}
}

// anchor
if(! function_exists('anchor'))
{
	/**
	 * Anchor Link
	 *
	 * Creates an anchor based on the local URL.
	 *
	 * @param	string	the URL
	 * @param	string	the link title
	 * @param	mixed	any attributes
	 * @return	string
	 */
	function anchor($uri = '', $title = '', $attributes = '')
	{
		$title = (string) $title;

		$site_url = is_array($uri)
			? url($uri)
			: (preg_match('#^(\w+:)?//#i', $uri) ? $uri : url($uri));

		if($title === '') {
			$title = $site_url;
		}

		if($attributes !== '') {
			$attributes = _stringify_attributes($attributes);
		}

		return '<a href="'.$site_url.'"'.$attributes.'>'.$title.'</a>';
	}
}

// heading
if(! function_exists('heading'))
{
    /**
     * @param: string $text
     * @param: string $heading
     * @param: mixed $attributes
     */
    function heading($text, $heading = 1, $attributes = '')
    {
        if(is_array($heading)) {
            $attributes = $heading;
            $heading = 1;
        }

        if($attributes !== '') {
			$attributes = _stringify_attributes($attributes);
		}

        return '<h'.$heading.$attributes.'>'.$text.'</h'.$heading.'>';
    }
}

// ws_get_results
if(! function_exists('ws_get_results'))
{
    /**
     * @param: string $table
     * @param: array $args
     */
    function ws_get_results($table, $args = [])
    {
        if(is_array($args)) {
            $args = ws_parse_args($args, ['output' => 'get']);
        }
        $result = ws_get_data($table, $args);
        return count($result) ? $result : [];
    }
}

// str_slug
if(! function_exists('str_slug'))
{
	/**
	 * @param: $str
	 */
	function str_slug($str)
	{
		return Str::slug($str);
	}
}

// str_lower
if(! function_exists('str_lower'))
{
	/**
	 * @param: string $str
	 */
	function str_lower($str)
	{
		if(function_exists('mb_strtolower')) {
            return mb_strtolower($str, 'UTF-8');
		}
		else {
			return strtolower($str);
		}
	}
}

// str_upper
if(! function_exists('str_upper'))
{
	/**
	 * @param: $str
	 */
	function str_upper($str)
	{
		if(function_exists('mb_strtoupper'))
		{
			return mb_strtoupper($str, 'UTF-8');
		}
		else {
			return strtoupper($str);
		}
	}
}

// str_wrap
if(! function_exists('str_wrap'))
{
	/**
	 * @param: $str
	 * @param: $extra
	 * @param: $elm
	 *
	 */
	function str_wrap($str, $attributes = array(), $elm = 'div')
	{
        if(isset($attributes['el'])) {
			$elm = $attributes['el'];
			unset($attributes['el']);
		}
		$str = is_array($str) ? implode($str) : $str;
		return '<'.$elm._stringify_attributes($attributes).'>'.$str.'</'.$elm.'>';
	}
}

// str_empty
if(! function_exists('str_empty'))
{
	/**
	 * @param: $str
	 * @param: $val
	 *
	 */
	function str_empty($str, $val = null)
	{
		return $str ? $str : $val;
	}
}

// str_number
if(! function_exists('str_number'))
{
	/**
	 * @param: $num
	 * @param: $sap
	 *
	 */
	function str_number($num, $sap = ',')
	{
		$sap = str_empty(get_option('num_format'), $sap);
		return strrev(substr(chunk_split(strrev($num), 3, $sap), 0, -1));
	}
}

// to_array
if(! function_exists('to_array'))
{
	/**
	 * @param: $obj
	 */
	function to_array($obj)
	{
		return (array) $obj;
	}
}

// to_object
if(! function_exists('to_object'))
{
	/**
	 * @param: $arr
	 */
	function to_object($arr)
	{
		return (object) $arr;
	}
}

// get_user_by
if(! function_exists('get_user_by'))
{
    /**
     * @param: $field
     * @param: $value
     */
    function get_user_by($field = "ID", $value = 0)
    {
        $user = ws_get_data('users', [
            'key' => $field,
            'value' => $value
        ]);
        return $user;
    }
}

// get_user_meta
if(! function_exists('get_user_meta'))
{
    /**
     * @param: $user_id
     * @param: $meta_key
     * @param: $single
     */
    function get_user_meta($user_id = 0, $meta_key = '', $single = false)
    {
        $user = get_user_by('ID', $user_id);
        if( empty( $user ) ) {
            return false;
        }
        if(true === $single and isset($user->$meta_key)) {
            return $user->$meta_key;
        }
        $meta_value = get_metadata('user', $user_id, $meta_key, $single);
		return $meta_value;
    }
}

// get_user_role
if(! function_exists('get_user_role'))
{
    /**
     * @param: int $userid
     */
    function get_user_role($userid, $field = 'id')
    {
        $user_role = get_user_meta($userid, 'role', true);
        return $user_role;
    }
}

// get_user_avatar
if(! function_exists('get_user_avatar'))
{
    /**
     * @param: int $userid
     */
    function get_user_avatar($userid, $args = [])
    {
        $user_avatar = get_user_meta($userid, 'avatar', true);
        if($user_avatar) {
            $display_name = get_user_meta($userid, 'display_name', true);
            $args = ws_parse_args($args, array('title' => $display_name));
            $args = ws_parse_args($args, array('alt' => $display_name));
            $user_avatar = get_the_post_thumbnail($user_avatar, $args);
        }
        return $user_avatar;
    }
}

// get_current_user_id
if(! function_exists('get_current_user_id'))
{
    /**
     * @param: void
     */
    function get_current_user_id()
    {
        if(! function_exists('ws_get_current_user')) {
            return 0;
        }
        $user = ws_get_current_user();
        return isset($user->ID) ? (int) $user->ID : 0;
    }
}

// home_url
if(! function_exists('home_url'))
{
    /**
     * @param: string $path
     */
    function home_url($path = '')
    {
        $url = get_option('home');
        if($path) {
            $url .= $path;
        }
        return $url;
    }
}

// admin_url
if(! function_exists('admin_url'))
{
    /**
     * @param: string|array $mod
     * @param: string|array $params
     */
    function admin_url($mod = '', $params = '')
    {
		$url = WS_ADMIN;
		if($mod) {
			if(is_array($mod)) {
				$url .= '?'.http_build_query($mod);
			}
			else {
				$mod = str_lower($mod);
				$url .= strstr($mod, '?') ? $mod : '?mod='.$mod;
			}
        }
        if($params and ($params != $mod)) {
			if(is_array($params)) {
				if($mod) {
					$url .= '&'.http_build_query($params);
				}
				else {
					$url .= '?'.http_build_query($params);
				}
			}
			else {
				$params = str_replace('?', '&', $params);
				if('&' != substr($params, 0, 1)) {
					$params = '&act='.$params;
				}
				$url .= $params;
			}
        }

		if($mod and $lang = request('lang') and ! strpos($url, '&lang=')) {
			$url .= '&lang='.$lang;
		}

		$url = apply_filters('admin_url', $url);
        return url($url);
    }
}

// upload_url
if(! function_exists('upload_url'))
{
    /**
     * @param: string $filename
     */
    function upload_url($filename = '')
    {
        return url('uploads/'.$filename);
    }
}

// current_url
if(! function_exists('current_url'))
{
    /**
     * @param: bool $full
     */
    function current_url($full = true)
    {
		if(true === $full) {
			return url()->full();
		}
		return url()->current();
    }
}

// upload_path
if(! function_exists('upload_path'))
{
    /**
     * @param: string $filename
     */
    function upload_path($filename = '')
    {
        return base_path('uploads/'.$filename);
    }
}

// assets_url
if(! function_exists('assets_url'))
{
    /**
     * @param: $filename
     */
    function assets_url($filename)
    {
        return resources_url('assets/'.$filename);
    }
}

// modules_url
if(! function_exists('modules_url'))
{
    /**
     * @param: $filename
     */
    function modules_url($filename)
    {
        return asset('app/Modules/'.ucfirst($filename));
    }
}

// modules_path
if(! function_exists('modules_path'))
{
    /**
     * @param: string $filename
     */
    function modules_path($filename = '')
    {
        return app_path('Modules/'.$filename);
    }
}

// resources_url
if(! function_exists('resources_url'))
{
    /**
     * @param: $filename
     */
    function resources_url($filename)
    {
        return asset('resources/'.$filename);
    }
}

// ws_enqueue_style
if(! function_exists('ws_enqueue_style'))
{
    /**
     * @param: string $handle
     * @param: string $src
     * @param: string|bool|null $ver
     * @param: array|bool $args
     */
    function ws_enqueue_style($handle, $src, $ver = false, $args = [])
    {
        if(boolval($ver)) {
            if(strpos($src, '://') and ! strpos($src, '?')) {
                $src = sprintf('%s?%s', $src, $ver);
            }
        }
        $args = ws_parse_args($args, [
            'el' => 'link',
            'id' => sprintf('ws-%s-js', $handle),
            'href' => $src,
            'rel' => 'stylesheet',
        ]);
        echo str_wrap(null, $args);
    }
}

// ws_enqueue_script
if(! function_exists('ws_enqueue_script'))
{
    /**
     * @param: string $handle
     * @param: string $src
     * @param: string|bool|null $ver
     * @param: array|bool $args
     */
    function ws_enqueue_script($handle, $src, $ver = false, $args = [])
    {
        if(boolval($ver)) {
            if(strpos($src, '://') and ! strpos($src, '?')) {
                $src = sprintf('%s?%s', $src, $ver);
            }
        }
        $args = ws_parse_args($args, [
            'el' => 'script',
            'id' => sprintf('ws-%s-js', $handle),
            'src' => $src,
        ]);
        echo str_wrap(null, $args);
    }
}

// add_hook
if(! function_exists('add_hook'))
{
	/*
	 * @param : $hook
	 * @param : $args
	 *
     */
	function add_hook($hook, $args = array())
	{
        if(! $data = config($hook)) {
			$data = array();
		}
		
		$args = ws_parse_args($args, [
			'priority' => 10,
			'callback' => [],
			'accepted_args' => 1,
		]);
		
		array_push($data, $args);
		
		config([$hook => $data]);
	}
}

// add_action
if(! function_exists('add_action'))
{
	/*
	 * @param : $tag
	 * @param : $function_to_add
	 * @param : $priority
	 * @param : $accepted_args
	 *
     */
	function add_action($tag, $function_to_add, $priority = 10, $accepted_args = 1)
	{
        add_hook(WS_PREFIX.'action_'.$tag, [
			'priority' => $priority,
			'callback' => $function_to_add,
			'accepted_args' => $accepted_args,
		]);
	}
}

// do_action
if(! function_exists('do_action'))
{
	/*
	 * @param : $tag
	 * @param : $arg
	 * @param : $debug
	 *
     */
	function do_action($tag, $arg = null)
	{
		$hook = WS_PREFIX.'action_'.$tag;
		if($arr = get_option($hook)) {
			usort($arr, function($a, $b){
				return $a['priority'] - $b['priority'];
			});
            foreach($arr as $tmp) {
                $callback = $tmp['callback'];
                if(is_callable($callback)) {
                    if($arg) {
                        $arg = func_get_args();
                        array_shift($arg);
                        $arg = array_slice($arg, 0, $tmp['accepted_args']);
                        echo call_user_func_array($callback, $arg);
                    }
                    else {
                        echo call_user_func($callback);
                    }
                }
            }
		}
	}
}

// add_filter
if(! function_exists('add_filter'))
{
	/*
	 * @param : $tag
	 * @param : $function_to_add
	 * @param : $priority
	 * @param : $accepted_args
	 *
     */
	function add_filter($tag, $function_to_add, $priority = 10, $accepted_args = 1)
	{
		add_hook(WS_PREFIX.'filter_'.$tag, [
			'priority' => $priority,
			'callback' => $function_to_add,
			'accepted_args' => $accepted_args,
		]);
	}
}

// apply_filters
if(! function_exists('apply_filters'))
{
	/*
	 * @param: $tag
	 * @param: $arg
	 * @param: $debug
	 *
     */
	function apply_filters($tag, $value = null)
	{
		$hook = WS_PREFIX.'filter_'.$tag;
		if($arr = get_option($hook)) {
			usort($arr, function($a, $b){
				return $a['priority'] - $b['priority'];
			});
            if($value) {
                $isArray = is_array($value) ? 1 : 0;
                $isString = is_string($value) ? 1 : 0;
                $arg = func_get_args();
                array_shift($arg);
                if($arg) {
                    foreach($arr as $tmp) {
                        if(is_callable($tmp['callback'])) {
                            $arg = array_slice($arg, 0, $tmp['accepted_args']);
                            $res = call_user_func_array($tmp['callback'], $arg);
                            if($isArray) {
                                $value = ws_parse_args($res, $value);
                            }
                            if($isString) {
                                $value = $res;
                            }
                        }
                    }
                }
                else {
                    foreach($arr as $tmp) {
                        $value = call_user_func($tmp['callback'], $value);
                    }
                }
            }
            else {
                if($arr) {
                    foreach($arr as $tmp) {
                        $value = call_user_func($tmp['callback'], $value);
                    }
                }
            }
		}
		
		return $value;
	}
}

// delete_session
if(! function_exists('delete_session'))
{
    /**
     * @param: string $name
     */
    function delete_session($name)
    {
        if(session()->has($name)) {
            session()->forget($name);
            return session()->flush();
        }
    }
}

// get_locale
if(! function_exists('get_locale'))
{
    /**
     * @param: string $locale
     */
    function get_locale($locale = 'vi')
    {
        if($lang = request('lang')) {
			if(ws_count_data('language', ['where' => ['name' => $lang]])) {
				session(['locale' => $lang]);
			}
		}

		if(session('locale')) {
			$locale = session('locale');
		}

		config(['app.locale' => $locale]);
		
        return $locale;
    }
}

// get_option
if(! function_exists('get_option'))
{
    /**
     * @param: string $name
     * @param: string $default
     */
    function get_option($name, $default = '')
    {
        // If home is not set, use siteurl.
        if('home' === $name and '' === $default) {
            return get_option('siteurl');
        }

        return config($name, $default);
    }
}

// add_option
if(! function_exists('add_option'))
{
    /**
     * @param: string $name
     * @param: mixed $value
     * @param: string $autoload
     */
    function add_option($name, $value, $autoload = 'yes')
    {
        if(! get_option($name)) {
            ws_insert_data('options', [
                'option_name' => $name,
                'option_value' => $value,
                'autoload' => $autoload,
            ]);
        }
        return $value;
    }
}

// update_option
if(! function_exists('update_option'))
{
    /**
     * @param: string $name
     * @param: mixed $value
     */
    function update_option($name, $value)
    {
        if(get_option($name)) {
            DB::table('options')->where('option_name', $name)->update(['option_value' => $value]);
        }
        return $value;
    }
}

// delete_option
if(! function_exists('delete_option'))
{
    /**
     * @param: string $name
     */
    function delete_option($name)
    {
        DB::table('options')->where('option_name', $name)->delete();
    }
}

// get_header
if(! function_exists('get_header'))
{
    /**
     * @param: string $name
     */
    function get_header($name = 'header')
    {
        $data = apply_filters('header_data', []);
        if($name === 'header') {
            echo view($name, $data);
        }
        else {
            echo view('header-'.$name, $data);
        }
    }
}

// get_footer
if(! function_exists('get_footer'))
{
    /**
     * @param: string $name
     */
    function get_footer($name = 'footer')
    {
        $data = apply_filters('footer_data', []);
        if($name === 'footer') {
            echo view($name, $data);
        }
        else {
            echo view('footer-'.$name, $data);
        }
    }
}

// get_sidebar
if(! function_exists('get_sidebar'))
{
    /**
     * @param: string $name
     */
    function get_sidebar($name = 'sidebar')
    {
        $data = apply_filters('sidebar_data', []);
        if($name === 'sidebar') {
            echo view($name, $data);
        }
        else {
            echo view('sidebar-'.$name, $data);
        }
    }
}

// get_template_part
if(! function_exists('get_template_part'))
{
    /**
     * @param: string $slug
     * @param: string $name
     * @param: string $args
     */
    function get_template_part($slug, $name = null, $args = [])
    {
        if($name) {
            if(is_array($name)) {
                echo view($slug, $name);
            }
            else {
                echo view($slug.'.'.$name, $args);
            }
        }
        else {
            echo view($slug, $args);
        }
    }
}

// ws_redirect
if(! function_exists('ws_redirect'))
{
	/**
	 * @param	string	$uri	URL
	 * @param	string	$method	Redirect method
	 *			'auto', 'location' or 'refresh'
	 * @param	int	$code	HTTP Response status code
	 * @return	void
	 */
	function ws_redirect($uri = '', $method = 'auto', $code = NULL)
	{
		if ( ! preg_match('#^(\w+:)?//#i', $uri))
		{
			$uri = home_url($uri);
		}

		// IIS environment likely? Use 'refresh' for better compatibility
		if($method === 'auto' && isset($_SERVER['SERVER_SOFTWARE']) && strpos($_SERVER['SERVER_SOFTWARE'], 'Microsoft-IIS') !== FALSE) {
			$method = 'refresh';
		}
		elseif ($method !== 'refresh' && (empty($code) OR ! is_numeric($code))) {
			if (isset($_SERVER['SERVER_PROTOCOL'], $_SERVER['REQUEST_METHOD']) && $_SERVER['SERVER_PROTOCOL'] === 'HTTP/1.1') {
				$code = ($_SERVER['REQUEST_METHOD'] !== 'GET')
					? 303	// reference: http://en.wikipedia.org/wiki/Post/Redirect/Get
					: 307;
			}
			else {
				$code = 302;
			}
		}

		switch ($method)
		{
			case 'refresh':
				header('Refresh:0;url='.$uri);
				break;
			default:
				header('Location: '.$uri, TRUE, $code);
				break;
		}
		exit;
	}
}

// ws_session
if(! function_exists('ws_session'))
{
    /**
     * @param: string $name
     * @param: mixed $value
     */
    function ws_session($name, $value = null)
    {
        if(null != $value) {
            Request::session()->put($name);
        }
        return Request::session()->get($name);
    }
}

// admin_head
if(! function_exists('admin_head'))
{
    /**
     * @param: void
     */
    function admin_head()
    {
        $blogname = get_option('blogname');
        $admin_title_tag = sprintf('%s - WebStore', $blogname);
        $admin_title_tag = apply_filters('admin_title_tag', $admin_title_tag);
        $admin_title_tag = sprintf('%s ‹ %s — WebStore', $admin_title_tag, $blogname);
        echo '<title>'.$admin_title_tag.'</title>';
		echo '<meta charset="utf-8">';
		echo '<meta name="robots" content="noindex,nofollow">';
		echo '<meta name="format-detection" content="telephone=no">';
		echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
		echo '<link href="'.upload_url(get_option('favicon')).'" rel="icon" type="image/png">';
        do_action('admin_head');
        do_action('admin_enqueue_scripts');
    }
}

// admin_footer
if(! function_exists('admin_footer'))
{
    /**
     * @param: void
     */
    function admin_footer()
    {
        do_action('admin_footer');
    }
}

// admin_body_class
if(! function_exists('admin_body_class'))
{
    /**
     * @param: void
     */
    function admin_body_class()
    {
		$uid = get_current_user_id();
		$sub = request('sub', 'manage');
        $pagenow = get_option('pagenow');
        $typenow = get_option('typenow');
		$admin_color = get_user_meta($uid, 'admin_color', true);
		$classes = ['ws-'.WS_ADMIN, 'scrollbar', 'sidebar-mini'];
        array_push($classes, 'skin-'.$admin_color, $pagenow);
		if($pagenow != $typenow) {
			array_push($classes, $pagenow.'-'.$typenow);
		}
		array_push($classes, $typenow.'-'.$sub);
        $classes = apply_filters(__function__,$classes);
        $classes = array_filter(array_unique($classes));
		echo sprintf('class="%s"', Arr::toCssClasses($classes));
    }
}

// ws_count_posts
if(! function_exists('ws_count_posts'))
{
    /**
     * @param: string $type
     * @param: array $args
     */
    function ws_count_posts($type = 'post', $args = [])
    {
        $table_id = sprintf('%s_id', $type);
        $where = isset($args['where']) ? $args['where'] : [];
        if(Schema::hasTable($type.'_desc')) {
            $table = sprintf('%s n, %s_desc d', $type, $type);
            $count = DB::table(DB::raw($table))
                                        ->select($table_id)
                                        ->whereColumn('n.'.$table_id, 'd.'.$table_id)
                                        ->where($where)
                                        ->count();
        }
        else {
            $count = ws_count_data($type, [
                'where' => $where,
                'fields' => $table_id,
            ]);
        }
        return $count;
    }
}

// ws_json
if(! function_exists('ws_json'))
{
    /**
     * @param: array $data
     */
    function ws_json($data = [])
    {
		echo json_encode($data); exit;
	}
}

// ws_output
if(! function_exists('ws_output'))
{
    /**
     * @param: string $view
     * @param: array $data
     */
    function ws_output($view, $data = [])
    {
        $view = apply_filters('ws_output_view', $view);
        $data = apply_filters('ws_output_data', $data);
        echo view($view, $data);
    }
}

// ws_get_current_user
if(! function_exists('ws_get_current_user'))
{
    /**
     * @param: string $type
     * @param: array $args
     */
    function ws_get_current_user()
    {
        $current_user = get_option('current_user');
        $cur_id = str_empty(session('userID'), 0);
        if(empty($current_user)) {
            $current_user = get_user_by('ID', $cur_id);
            if($current_user) {
                config(['current_user' => $current_user]);
            }
        }
        return $current_user;
    }
}

// ws_load_alloptions
if(! function_exists('ws_load_alloptions'))
{
    /**
     * @param: bool $force_cache
     */
    function ws_load_alloptions($force_cache = false)
    {
        $alloptions = apply_filters('pre_ws_load_alloptions', [], $force_cache);
        if($alloptions and is_array($alloptions)) {
            config($alloptions);
            return $alloptions;
        }

        $alloptions = [];
        $options = ws_get_results('options', ['key' => 'autoload', 'value' => 'yes']);
        foreach($options as $option) {
            $hook = sprintf('pre_option_%s', $option->option_name);
            $alloptions[$option->option_name] = apply_filters($hook, $option->option_value);
        }
        $options = ws_get_data('language', [
            'key' => 'name',
            'value' => get_locale(),
            'fields' => array('meta_lang', 'unit', 'date_format', 'time_format', 'num_format'),
        ]);
        foreach($options as $name => $value) {
            $hook = sprintf('pre_option_%s', $name);
            $alloptions[$name] = apply_filters($hook, $value);
        }
        $pagenow = request('mod', 'dashboard');
        $typenow = request('act', $pagenow);
        $alloptions = ws_parse_args($alloptions, [
            'pagenow' => $pagenow,
            'typenow' => $typenow,
        ]);

        $alloptions = apply_filters('alloptions', $alloptions);

        // dd($alloptions);
        
        config($alloptions);
        return $alloptions;
    }
}

// ws_parse_args
if(! function_exists('ws_parse_args'))
{
	/**
	 * @param: $args
	 * @param: $defaults
	 */
	function ws_parse_args($args, $defaults = [])
	{
		if($args and ! is_array($args)) {
			$args = to_array($args);
		}
		if($defaults and ! is_array($defaults)) {
			$defaults = to_array($defaults);
		}
		$args = array_merge($defaults, $args);
		return $args;
	}
}

// ws_get_data
if(! function_exists('ws_get_data'))
{
	/**
	 * @param: $table
	 * @param: $args
	 */
	function ws_get_data($table, $args = [])
	{
        $query = DB::table($table);

        if($args and is_callable($args)) {
            return call_user_func($args, $query);
        }

        $args = ws_parse_args($args, [
            'fields' => '',
            'where' => [],
            'key' => '',
            'value' => '',
            'limit' => 0,
            'showposts' => 0,
            'number' => 0,
            'offset' => 0,
            'orderby' => '',
            'output' => 'first',
            'query' => array(),
        ]);

        $obj = to_object($args);

        if($obj->fields) {
            $query->select($obj->fields);
        }

        if($obj->key) {
            $query->where($obj->key, $obj->value);
        }

        if($obj->where) {
            $query->where($obj->where);
        }
        
        if($obj->query and is_array($obj->query)) {
            foreach($obj->query as $q) {
                $q = ws_parse_args($q, ['key' => '', 'value' => '', 'method' => '']);
                $query->{$q['method']}($q['key'], $q['value']);
            }
        }

        if($obj->limit) {
            $query->limit($obj->limit);
            $query->offset($obj->offset);
        }
        
        if($orderby = $obj->orderby) {
            $arr = explode(',', $orderby);
            foreach($arr as $str) {
                $str = trim($str);
                $tmp = explode(' ', $str);
                $field = array_shift($tmp);
                $order = array_shift($tmp);
                if($order) {
                    $query->orderBy($field, $order);
                }
                else {
                    $query->orderBy($field);
                }
            }
        }
        
        return $query->{$obj->output}();
	}
}

// ws_count_data
if(! function_exists('ws_count_data'))
{
	/**
	 * @param: $table
	 * @param: $args
	 */
	function ws_count_data($table, $args = [])
	{
		$args = ws_parse_args($args, [
			'where' => [],
			'table' => $table,
		]);
		$where = str_empty($args['where'], []);
		$table = str_empty($args['table'], $table);
        $count = ws_get_data($table, [
            'where' => $where,
            'output' => 'count',
        ]);
		return $count;
	}
}

// ws_insert_data
if(! function_exists('ws_insert_data'))
{
    /**
     * @param: string $table
     * @param: array $data
     */
    function ws_insert_data($table, $data = [])
    {
        return DB::table($table)->insertGetId($data);
    }
}

// ws_update_data
if(! function_exists('ws_update_data')) 
{
	/**
     * @param: $table
     * @param: $where
     * @param: $data
     */
	function ws_update_data($table, $where, $data)
	{
		return DB::table($table)->where($where)->update($data);
	}
}

// ws_delete_data
if(! function_exists('ws_delete_data')) 
{
	/**
	 * @param: $table
     * @param: $where
     */
	function ws_delete_data($table, $where)
	{
		return DB::table($table)->where($where)->delete();
	}
}

// get_metadata
if(! function_exists('get_metadata'))
{
	/**
	 * @param: string $meta_type
	 * @param: int $object_id
	 * @param: string $meta_key
	 * @param: bool $single
	 */
	function get_metadata($meta_type, $object_id, $meta_key = '', $single = false)
	{
        $where = array($meta_type.'_id' => $object_id);

		if($single === true) {
            $where = ws_parse_args($where, ['meta_key' => $meta_key]);
            $args = array('where' => $where);
            $metadata = ws_get_data($meta_type.'meta', $args);
            return $metadata ? $metadata->meta_value : false;
        }

        if($meta_key) {
            $where = ws_parse_args($where, ['meta_key' => $meta_key]);
        }

        $metadata = ws_get_results($meta_type.'meta', ['where' => $where]);

        return $metadata;
	}
}

// add_metadata
if(! function_exists('add_metadata'))
{
	/**
	 * @param: $meta_type
	 * @param: $object_id
	 * @param: $meta_key
	 * @param: $meta_value
	 */
	function add_metadata($meta_type, $object_id, $meta_key, $meta_value)
	{
		$return = false;
		$table = $meta_type.'meta';
		$where = [
			$keyid => $object_id,
			'meta_key' => $meta_key,
		];
		$count = ws_count_data($table, ['where' => $where]);
		if($count) {
			$return = update_metadata($meta_type, $object_id, $meta_key, $meta_value);
		}
		else {
			$metadata = ['meta_value' => $meta_value];
			$metadata = ws_parse_args($where, $metadata);
			$return = ws_insert_data($table, $metadata);
		}
		return $return;
	}
}

// update_metadata
if(! function_exists('update_metadata'))
{
	/**
	 * @param: $meta_type
	 * @param: $object_id
	 * @param: $meta_key
	 * @param: $meta_value
	 */
	function update_metadata($meta_type, $object_id, $meta_key, $meta_value)
	{
		$return = false;
		$table = $meta_type.'meta';
		$where = ['meta_key' => $meta_key];
		$args = ['where' => $where];
		$count = ws_count_data($table, $args);
		if($count) {
			$metadata = ['meta_value' => $meta_value];
			$metadata = ws_parse_args($where, $metadata);
			$return = ws_update_data($table, $where, $metadata);
		}
		else {
			$return = add_metadata($meta_type, $object_id, $meta_key, $meta_value);
		}
		return $return;
	}
}

// delete_metadata
if(! function_exists('delete_metadata'))
{
	/**
	 * @param: $meta_type
	 * @param: $object_id
	 * @param: $meta_key
	 * @param: $meta_value
	 * @param: $delete_all
	 */
	function delete_metadata($meta_type, $object_id, $meta_key = "", $meta_value = '', $delete_all = false)
	{
		$where = array($meta_type.'_id' => $object_id);
		if($delete_all === false) {
			if($meta_key) {
				$where['meta_key'] = $meta_key;
			}
			if($meta_value) {
				$where['meta_value'] = $meta_value;
			}
		}
		return ws_delete_data($meta_type.'meta', $where);
	}
}

// get_the_post_thumbnail
if(! function_exists('get_the_post_thumbnail'))
{
	/**
	 * @param: $picture
	 * @param: $args
	 */
	function get_the_post_thumbnail($picture, $args = [])
	{
		$src = upload_url($picture);
		$ext = strrchr($picture, '.');
		$alt = str_replace($ext, '', basename($src));
		$exts = array('.ico', '.svg', '.gif', '.webp');
		$w = array_key_exists('width', $args) ? $args['width'] : 0;
		$h = array_key_exists('height', $args) ? $args['height'] : 0;
		$thumb = array_key_exists('thumb', $args) ? $args['thumb'] : 1;
		if(in_array($ext, $exts)) {
			$args = ws_parse_args($args, [
				'alt' => $alt,
				'title' => $alt,
				'width' => $w,
				'height' => $h,
			]);
		}
		elseif(function_exists('imagewebp')) {
			$source = upload_path($picture);
			$source = str_replace('%20', ' ', $source);
			$dir = pathinfo($source, PATHINFO_DIRNAME);
			$destination = sprintf('%s/%s.webp', $dir, str_slug($alt));
			if(! file_exists($destination)) {
				$image = false;
				$quality = isset($args['quality']) ? $args['quality'] : 80;
				$isAlpha = isset($args['isAlpha']) ? $args['isAlpha'] : false;
				$info = @getimagesize($source);
				if($info['mime'] == 'image/jpeg') {
					$image = imagecreatefromjpeg($source);
				}
				elseif($isAlpha = $info['mime'] == 'image/png'){
					$image = imagecreatefrompng($source);
				}
				elseif($isAlpha = $info['mime'] == 'image/gif'){
					$image = imagecreatefromgif($source);
				}
				if($image) {
					if($isAlpha) {
						imagepalettetotruecolor($image);
						imagealphablending($image, true);
						imagesavealpha($image, true);
					}
					imagewebp($image, $destination, $quality);
				}
			}
			$src = str_replace(ROOT_PATH, ROOT_URL, $destination);
		}
		else {
			$dir = substr($picture, 0, strrpos($picture, '/'));
			if($w) {
				$pre = sprintf('%ux%u', $w, $h);
				if($thumb && file_exists(upload_path($picture))) {
					$file_thumbs = sprintf('%s/%s-%s%s', $dir, str_slug($alt), $pre, $ext);
					$link_thumbs = upload_path($file_thumbs);
					if(! file_exists($link_thumbs)) {
						// if(is_dir(upload_path($dir.'/thumbs'))) {
						//     @chmod(upload_path($dir.'/thumbs'), 0777);
						// }
						// else {
						//     @mkdir(upload_path($dir.'/thumbs'), 0777);
						//     @chmod(upload_path($dir.'/thumbs'), 0777);
						// }
						_thumbs(upload_path($picture), $link_thumbs, $w, $h);
					}
					$src = upload_url($file_thumbs);
				}
				else {
					$src = upload_url($dir.'/'.basename($src));
				}
			}
		}

		$args = ws_parse_args($args, [
			'el' => 'img',
			'src' => $src,
			'alt' => $alt,
			'title' => $alt,
		]);

		$args = array_filter($args);

		return str_wrap(null, $args);
	}
}

// is_admin
if(! function_exists('is_admin'))
{
	/**
	 * @param: void
	 */
	function is_admin()
	{
		return (admin_url() == current_url(false) and session('loggedIn') and ws_get_current_user()) ? true : false;
	}
}