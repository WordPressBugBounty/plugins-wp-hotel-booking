<?php
/**
 * WP Hotel Booking Paypal.
 *
 * @version       1.9.6
 * @author        ThimPress
 * @package       WP_Hotel_Booking/Classes
 * @category      Classes
 * @author        Thimpress, leehld
 */

/**
 * Prevent loading this file directly
 */
defined( 'ABSPATH' ) || exit;

/**
 * Class WPHB_Payment_Gateway_Paypal
 */
class WPHB_Payment_Gateway_Paypal extends WPHB_Payment_Gateway_Base {
	protected $_slug = 'paypal';

	/**
	 * @var null
	 */
	protected $paypal_live_url = null;

	/**
	 * @var null
	 */
	protected $paypal_sandbox_url = null;

	/**
	 * @var null
	 */
	protected $paypal_payment_live_url = null;

	/**
	 * @var null
	 */
	protected $paypal_payment_sandbox_url = null;

	/**
	 * @var null
	 */
	protected $paypal_nvp_api_live_url = null;

	/**
	 * @var null
	 */
	protected $paypal_nvp_api_sandbox_url = null;

	/**
	 * @var null
	 */
	protected $paypal_client_secret = null;
	/**
	 * @var null
	 */
	protected $paypal_client_id = null;
	/**
	 * @var null
	 */
	protected $api_sandbox_url = 'https://api-m.sandbox.paypal.com/';
	/**
	 * @var string
	 */
	protected $api_live_url = 'https://api-m.paypal.com/';
	/**
	 * @var string|null
	 */
	protected $api_url = null;

	/**
	 * @var array
	 */
	protected $_settings = array();

	/**
	 * Construction
	 */
	function __construct() {
		$this->_title       = __( 'Paypal', 'wp-hotel-booking' );
		$this->_description = __( 'Pay with Paypal', 'wp-hotel-booking' );
		$this->_settings    = WPHB_Settings::instance()->get( 'paypal' );

		parent::__construct();

		$this->paypal_live_url            = 'https://www.paypal.com/';
		$this->paypal_sandbox_url         = 'https://www.sandbox.paypal.com/';
		$this->paypal_payment_live_url    = 'https://www.paypal.com/cgi-bin/webscr';
		$this->paypal_payment_sandbox_url = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
		$this->paypal_nvp_api_live_url    = 'https://api-3t.paypal.com/nvp';
		$this->paypal_nvp_api_sandbox_url = 'https://api-3t.sandbox.paypal.com/nvp';
		$settings                         = $this->_settings;
		if ( ! empty( $this->_settings['use_paypal_rest'] ) && $settings['use_paypal_rest'] == 'on' ) {
			$this->paypal_client_id     = $settings['app_client_id'];
			$this->paypal_client_secret = $settings['app_client_secret'];
		}
		$this->api_url = ( !empty( $settings['sandbox'] ) && $settings['sandbox'] == 'on' ) ? $this->api_sandbox_url : $this->api_live_url;

		$this->init();
	}

	/**
	 * Init hooks
	 */
	function init() {
		add_action( 'hb_payment_gateway_form_' . $this->slug, array( $this, 'form' ) );
		add_action( 'hb_do_checkout_' . $this->_slug, array( $this, 'process_checkout' ) );

		add_action( 'hb_manage_booking_column_total', array( $this, 'column_total_content' ), 10, 3 );
		add_filter( 'hb_payment_method_title_paypal', array( $this, 'payment_method_title' ) );
		hb_register_web_hook( 'paypal-standard', 'hotel-booking-paypal-standard' );
		if ( ! empty( $this->_settings['use_paypal_rest'] ) && $this->_settings['use_paypal_rest'] == 'on' ) {
			$this->capture_payment_for_order();
		} else {
			add_action( 'hb_do_transaction_paypal-standard', array( $this, 'process_booking_paypal_standard' ) );
			add_action( 'hb_web_hook_hotel-booking-paypal-standard', array( $this, 'web_hook_process_paypal_standard' ) );
		}
	}

	/**
	 * Get payment method title
	 *
	 * @return mixed
	 */
	function payment_method_title() {
		return $this->_description;
	}

	/**
	 * Display text in total column
	 *
	 * @param $booking_id
	 * @param $total
	 * @param $total_with_currency
	 */
	function column_total_content( $booking_id, $total, $total_with_currency ) {
		if ( $total && get_post_meta( $booking_id, '_hb_method', true ) == 'paypal-standard' ) {
			$advance_payment = get_post_meta( $booking_id, '_hb_advance_payment', true );
			printf( __( '<br /><small>(Paid %1$s%% of %2$s via %3$s)</small>', 'wp-hotel-booking' ), round( $advance_payment / $total, 2 ) * 100, $total_with_currency, 'Paypal' );
		}
	}

	function form() {
		echo _e( 'Pay with Paypal', 'wp-hotel-booking' );
	}

	/**
	 * @return bool
	 */
	function process_booking_paypal_standard() {
		if ( ! empty( $_REQUEST['hb-transaction-method'] ) && ( 'paypal-standard' == sanitize_text_field( wp_unslash( $_REQUEST['hb-transaction-method'] ) ) ) ) {
			$cart = WPHB_Cart::instance();
			$cart->empty_cart();

			wp_redirect( get_site_url() );
			exit();
		}

		wp_redirect( get_site_url() );
		exit();
	}

	/**
	 * Web hook to process booking with Paypal IPN
	 *
	 * @param $request
	 */
	function web_hook_process_paypal_standard( $request ) {
		$payload        = array_merge_recursive( array( 'cmd' => '_notify-validate' ), wp_unslash( $_POST ) );
		$paypal_api_url = ! empty( $_REQUEST['test_ipn'] ) ? $this->paypal_payment_sandbox_url : $this->paypal_payment_live_url;

		$params   = array(
			'body'        => $payload,
			'timeout'     => 60,
			'httpversion' => '1.1',
			'compress'    => false,
			'decompress'  => false,
			'user-agent'  => 'HotelBooking',
		);
		$response = wp_safe_remote_post( $paypal_api_url, $params );
		$body     = wp_remote_retrieve_body( $response );

		if ( 'VERIFIED' === $body ) {
			if ( ! empty( $request['txn_type'] ) ) {

				switch ( $request['txn_type'] ) {
					case 'web_accept':
						if ( ! empty( $request['custom'] ) && ( $booking = $this->get_booking( $request['custom'] ) ) ) {
							$request['payment_status'] = strtolower( $request['payment_status'] );

							if ( isset( $request['test_ipn'] ) && 1 == $request['test_ipn'] && 'pending' == $request['payment_status'] ) {
								$request['payment_status'] = 'completed';
							}
							if ( method_exists( $this, 'payment_status_' . $request['payment_status'] ) ) {
								call_user_func(
									array(
										$this,
										'payment_status_' . $request['payment_status'],
									),
									$booking,
									$request
								);
							}
						}
						break;

				}
			}
		}
	}

	function get_booking( $raw_custom ) {
		$raw_custom = stripslashes( $raw_custom );
		if ( ( $custom = json_decode( $raw_custom ) ) && is_object( $custom ) ) {
			$booking_id  = $custom->booking_id;
			$booking_key = $custom->booking_key;

			// Fallback to serialized data if safe. This is @deprecated in 2.3.11
		} elseif ( preg_match( '/^a:2:{/', $raw_custom ) && ! preg_match( '/[CO]:\+?[0-9]+:"/', $raw_custom ) && ( $custom = maybe_unserialize( $raw_custom ) ) ) {
			$booking_id  = $custom[0];
			$booking_key = $custom[1];

			// Nothing was found
		} else {
			_e( 'Error: Booking ID and key were not found in "custom".', 'wp-hotel-booking' );

			return false;
		}

		if ( ! $booking = WPHB_Booking::instance( $booking_id ) ) {
			$booking_id = hb_get_booking_id_by_key( $booking_key );
			$booking    = WPHB_Booking::instance( $booking_id );
		}

		if ( ! $booking || $booking->booking_key !== $booking_key ) {
			printf( __( 'Error: Booking Keys do not match %1$s and %2$s.', 'wp-hotel-booking' ), $booking->booking_key, $booking_key );

			return false;
		}

		return $booking;
	}

	/**
	 * Handle a completed payment
	 *
	 * @param WPHB_Booking
	 * @param Paypal IPN params
	 */
	protected function payment_status_completed( $booking, $request ) {
		// Booking status is already completed
		if ( $booking->has_status( 'completed' ) ) {
			exit;
		}

		if ( 'completed' === $request['payment_status'] ) {
			if ( (float) $booking->total === (float) $request['payment_gross'] ) {
				$this->payment_complete( $booking, ( ! empty( $request['txn_id'] ) ? $request['txn_id'] : '' ), __( 'IPN payment completed', 'wp-hotel-booking' ) );
			} else {
				$booking->update_status( 'processing' );
			}
			// save paypal fee
			if ( ! empty( $request['mc_fee'] ) ) {
				update_post_meta( $booking->post->id, 'PayPal Transaction Fee', $request['mc_fee'] );
			}
		} else {

		}
	}

	/**
	 * Handle a pending payment
	 *
	 * @param  WPHB_Booking
	 * @param Paypal IPN params
	 */
	protected function payment_status_pending( $booking, $request ) {
		$this->payment_status_completed( $booking, $request );
	}

	/**
	 * @param WPHB_Booking
	 * @param string       $txn_id
	 * @param string       $note - not use
	 */
	function payment_complete( $booking, $txn_id = '', $note = '' ) {
		$booking->payment_complete( $txn_id );
	}

	/**
	 * Retrieve order by paypal txn_id
	 *
	 * @param $txn_id
	 *
	 * @return int
	 */
	function get_order_id( $txn_id ) {

		$args = array(
			'meta_key'    => '_hb_method_id',
			'meta_value'  => $txn_id,
			'numberposts' => 1, // we should only have one, so limit to 1
		);

		$bookings = hb_get_bookings( $args );
		if ( $bookings ) {
			foreach ( $bookings as $booking ) {
				return $booking->ID;
			}
		}

		return 0;
	}

	public function get_paypal_access_token() {
		if ( empty( $this->paypal_client_id ) ) {
			throw new Exception( 'Paypal App Client id is required.', 'wp-hotel-booking' );
		}
		if ( empty( $this->paypal_client_secret ) ) {
			throw new Exception( 'Paypal App Client secret is required.', 'wp-hotel-booking' );
		}
		$params         = [ 'grant_type' => 'client_credentials' ];
		$response       = wp_remote_post(
			$this->api_url . 'v1/oauth2/token',
			[
				'body'    => $params,
				'headers' => [
					'Authorization' => 'Basic ' . base64_encode( $this->paypal_client_id . ':' . $this->paypal_client_secret ),
				],
				'timeout' => 60,
			]
		);
		$data_token_str = wp_remote_retrieve_body( $response );
		$data_token     = json_decode( $data_token_str );
		if ( json_last_error() !== JSON_ERROR_NONE ) {
			throw new Exception( json_last_error_msg() );
		}
		return $data_token;
	}

	public function get_app_payment_url( $booking_id, $amount ) {
		$checkout_url = '';
		if ( ! $booking_id ) {
			throw new Exception( 'Invalid booking.', 'wp-hotel-booking' );
		}
		$booking      = WPHB_Booking::instance( $booking_id );
		$success_url  = add_query_arg( 'paypay_express_checkout', 1, hb_get_thank_you_url( $booking_id, $booking->booking_key ) );
		$cancel_url   = hb_get_checkout_url();
		$booking_data = [
			'intent'         => 'CAPTURE',
			'purchase_units' => [
				[
					'amount'    => [
						'currency_code' => hb_get_currency(),
						'value'         => number_format( $amount, 2 ),
					],
					'custom_id' => $booking_id,
				],
			],
			'payment_source' => [
				'paypal' => [
					'experience_context' => [
						'payment_method_preference' => 'UNRESTRICTED',
						'brand_name'                => get_bloginfo(),
						'landing_page'              => 'LOGIN',
						'user_action'               => 'PAY_NOW',
						'return_url'                => $success_url,
						'cancel_url'                => $cancel_url,
					],
				],
			],
		];
		$booking_data = apply_filters( 'wp-hotel-booking/paypal-rest/args', $booking_data, $booking_id );
		$data_token   = $this->get_paypal_access_token();
		if ( ! isset( $data_token->access_token ) || ! isset( $data_token->token_type ) ) {
			throw new Exception( __( 'Invalid Paypal access token', 'wp-hotel-booking' ) );
		}
		$response = wp_remote_post(
			$this->api_url . 'v2/checkout/orders',
			[
				'body'    => json_encode( $booking_data ),
				'headers' => [
					'Authorization' => $data_token->token_type . ' ' . $data_token->access_token,
					'Content-Type'  => 'application/json',
				],
				'timeout' => 60,
			]
		);
		$result   = json_decode( wp_remote_retrieve_body( $response ) );
		if ( json_last_error() !== JSON_ERROR_NONE ) {
			throw new Exception( json_last_error_msg() );
		}

		if ( empty( $result->links ) ) {
			throw new Exception( __( 'Invalid Paypal checkout url', 'wp-hotel-booking' ) );
		}

		foreach ( $result->links as $link ) {
			if ( $link->rel === 'payer-action' ) {
				$checkout_url = $link->href;
				break;
			}
		}

		if ( empty( $checkout_url ) ) {
			throw new Exception( __( 'Invalid Paypal checkout url', 'wp-hotel-booking' ) );
		}

		return $checkout_url;
	}

	public function capture_payment_for_order() {
		if ( ! isset( $_GET['paypay_express_checkout'] ) ) {
			return;
		}
		$paypal_order_id = hb_get_request( 'token' );
		if ( empty( $paypal_order_id ) ) {
			return;
		}
		try {
			$data_token = $this->get_paypal_access_token();
			if ( ! isset( $data_token->access_token ) || ! isset( $data_token->token_type ) ) {
				throw new Exception( __( 'Invalid Paypal access token', 'wp-hotel-booking' ) );
			}

			$response = wp_remote_post(
				$this->api_url . 'v2/checkout/orders/' . $paypal_order_id . '/capture',
				array(
					'headers' => array(
						'Content-Type'  => 'application/json',
						'Authorization' => $data_token->token_type . ' ' . $data_token->access_token,
					),
					'timeout' => 60,
				)
			);

			if ( $response['response']['code'] === 201 ) {
				$body        = wp_remote_retrieve_body( $response );
				$transaction = json_decode( $body );
				if ( json_last_error() !== JSON_ERROR_NONE ) {
					throw new Exception( json_last_error_msg() );
				}
				if ( $transaction->status === 'COMPLETED' ) {
					$booking_id  = $transaction->purchase_units[0]->payments->captures[0]->custom_id;
					$booking     = WPHB_Booking::instance( $booking_id );
					$paid_amount = $transaction->purchase_units[0]->payments->captures[0]->amount->value;
					if ( (float) $paid_amount == (float) $booking->total() ) {
						$booking->update_status( 'completed' );
					} else {
						$booking->update_status( 'processing' );
					}
				}
			}
		} catch ( Throwable $e ) {
			error_log( __METHOD__ . $e->getMessage() );
		}
	}

	/**
	 * Get Paypal checkout url
	 *
	 * @param $booking_id
	 *
	 * @return string
	 */
	protected function _get_paypal_basic_checkout_url( $booking_id ) {

		$paypal = WPHB_Settings::instance()->get( 'paypal' );

		$paypal_args = array(
			'cmd'      => '_xclick',
			'amount'   => round( WP_Hotel_Booking::instance()->cart->hb_get_cart_total( ! hb_get_request( 'pay_all' ) ), 2 ),
			'quantity' => '1',
		);

		$booking         = WPHB_Booking::instance( $booking_id );
		$advance_payment = hb_get_advance_payment();
		$pay_all         = hb_get_request( 'pay_all' );

		$nonce        = wp_create_nonce( 'hb-paypal-nonce' );
		$paypal_email = $paypal['sandbox'] === 'on' ? $paypal['sandbox_email'] : $paypal['email'];
		$custom       = array(
			'booking_id'  => $booking_id,
			'booking_key' => $booking->booking_key,
		);
		if ( $advance_payment && ! $pay_all ) {
			$custom['advance_payment'] = $advance_payment;
		}

		$query = array(
			'business'      => $paypal_email,
			'item_name'     => hb_get_cart_description(),
			'return'        => hb_get_thank_you_url( $booking_id, $booking->booking_key ),
			'currency_code' => hb_get_currency(),
			'notify_url'    => get_site_url() . '/?' . hb_get_web_hook( 'paypal-standard' ) . '=1',
			'no_note'       => '1',
			'shipping'      => '0',
			'email'         => $booking->customer_email,
			'rm'            => '2',
			'cancel_return' => hb_get_return_url(),
			'custom'        => json_encode( $custom ),
			'no_shipping'   => '1',
		);

		$query = array_merge( $paypal_args, $query );

		$query = apply_filters( 'hb_paypal_standard_query', $query );

		$paypal_payment_url = ( $paypal['sandbox'] === 'on' ? $this->paypal_payment_sandbox_url : $this->paypal_payment_live_url ) . '?' . http_build_query( $query );

		return $paypal_payment_url;
	}

	/**
	 * Process checkout
	 *
	 * @param null $booking_id
	 *
	 * @return array
	 */
	function process_checkout( $booking_id = null ) {
		if ( $this->_settings['use_paypal_rest'] == 'on' ) {
			$cart        = WPHB_Cart::instance();
			$advance_pay = $cart->get_advance_payment();
			$cart_total  = $cart->get_total();
			if ( ! hb_get_request( 'pay_all' ) ) {
				// when advance pay setting = 0%, amount is cart total
				$amount_total = $advance_pay > 0 ? $advance_pay : $cart_total;
			} else {
				$amount_total = $cart_total;
			}
			return array(
				'result'   => 'success',
				'redirect' => $this->get_app_payment_url( $booking_id, floatval( $amount_total ) ),
			);
		} else {
			return array(
				'result'   => 'success',
				'redirect' => $this->_get_paypal_basic_checkout_url( $booking_id ),
			);
		}
	}

	/**
	 * Print admin settings page
	 *
	 * @param $gateway
	 */
	function admin_settings() {
		$template = WP_Hotel_Booking::instance()->locate( 'includes/gateways/paypal/views/settings.php' );
		include_once $template;
	}

	/**
	 * @return bool
	 */
	function is_enable() {
		return ! empty( $this->_settings['enable'] ) && $this->_settings['enable'] == 'on';
	}
}

add_filter( 'hb_payment_gateways', 'hotel_booking_payment_paypal' );
if ( ! function_exists( 'hotel_booking_payment_paypal' ) ) {
	function hotel_booking_payment_paypal( $payments ) {
		if ( array_key_exists( 'paypal', $payments ) ) {
			return $payments;
		}

		$payments['paypal'] = new WPHB_Payment_Gateway_Paypal();

		return $payments;
	}
}
