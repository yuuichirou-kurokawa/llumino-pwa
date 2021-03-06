// @flow

import {describe, it} from 'mocha';
import Assert from 'power-assert';

import Calculator from './calculator';

import type {ButtonId} from '../button-id';

function pushButtons(calc: Calculator, buttonIds: ButtonId[]) {
	buttonIds.forEach((buttonId) => {
		calc.pushButton(buttonId);
	});
}

describe('Calculator', () => {
	it('Initial state should be zero', () => {
		const calc = new Calculator();
		Assert.strictEqual(
			calc.answer,
			0,
		);
	});

	it('should input integer directly', () => {
		const calc = new Calculator();
		pushButtons(calc, ['3', '1', '4', '=']);
		Assert.strictEqual(
			calc.answer,
			314,
		);
	});

	it('should clear inputting digits', () => {
		const calc = new Calculator();
		pushButtons(calc, ['3', '1', '4', 'c']);
		Assert.strictEqual(
			calc.answer,
			0,
		);
	});

	it('should clear answer', () => {
		const calc = new Calculator();
		pushButtons(calc, ['3', '1', '4', '=', 'c']);
		Assert.strictEqual(
			calc.answer,
			0,
		);
	});

	it('should clear inputting digits', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'3', '1', '4', '+',
			'5', '6', 'c',
		]);
		Assert.strictEqual(
			calc.answer,
			314,
		);
	});

	it('should clear inputting digits with operator', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'3', '1', '4', '+',
			'c',
		]);
		Assert.strictEqual(
			calc.answer,
			0,
		);
	});

	it('should do nothing for initial deletion', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'bs',
		]);
		Assert.strictEqual(
			calc.answer,
			0,
		);
	});

	it('should delete a last input digit', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'3', '.', '1', '4', 'bs',
			'=',
		]);
		Assert.strictEqual(
			calc.answer,
			3.1,
		);
	});

	it('should do nothing for over-deletion', () => {
		Assert.doesNotThrow(() => {
			const calc = new Calculator();
			pushButtons(calc, [
				'4', '2', 'bs', 'bs', 'bs',
			]);
		});
	});

	it('should do nothing for deleting buffered operator', () => {
		Assert.doesNotThrow(() => {
			const calc = new Calculator();
			pushButtons(calc, [
				'1', '2', '3', '4', '+',
				'bs',
			]);
		});
	});

	it('should input decimal number directly', () => {
		const calc = new Calculator();
		pushButtons(calc, ['2', '.', '7', '2', '=']);
		Assert.strictEqual(
			calc.answer,
			2.72,
		);
	});

	it('should treat single `.` as 0', () => {
		const calc = new Calculator();
		pushButtons(calc, ['.', '=']);
		Assert.strictEqual(
			calc.answer,
			0,
		);
	});

	it('should treat digits that start with `.` as `0.`', () => {
		const calc = new Calculator();
		pushButtons(calc, ['.', '4', '6', '=']);
		Assert.strictEqual(
			calc.answer,
			0.46,
		);
	});

	it('should not input duplicated dots', () => {
		const calc = new Calculator();
		pushButtons(calc, ['1', '.', '9', '.', '8', '6', '=']);
		Assert.strictEqual(
			calc.answer,
			1.986,
		);
	});

	it('should cancel buffered operator', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', '2', '*',
			'=',
		]);
		Assert.strictEqual(
			calc.answer,
			12,
		);
	});

	it('should operate a number', () => {
		{
			const calc = new Calculator();
			pushButtons(calc, ['1', '2', '+', '3', '=']);
			Assert.strictEqual(
				calc.answer,
				12 + 3,
				'should add a number'
			);
		} {
			const calc = new Calculator();
			pushButtons(calc, ['4', '-', '5', '6', '=']);
			Assert.strictEqual(
				calc.answer,
				4 - 56,
				'should substract a number'
			);
		} {
			const calc = new Calculator();
			pushButtons(calc, ['7', '8', '*', '9', '0', '=']);
			Assert.strictEqual(
				calc.answer,
				78 * 90,
				'should multiply a number'
			);
		} {
			const calc = new Calculator();
			pushButtons(calc, ['1', '2', '/', '3', '4', '=']);
			Assert.strictEqual(
				calc.answer,
				12 / 34,
				'should divide a number'
			);
		}
	});

	it('should operate multiple numbers', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', '2', '+',
			'3', '4', '-',
			'5', '6', '*',
			'7', '8', '/',
			'9', '0', '=',
		]);
		Assert.strictEqual(
			calc.answer,
			((((12 + 34) - 56) * 78) / 90),
		);
	});

	it('should change an operator', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', '2',
			'+', '-', '*',
			'3', '4', '=',
		]);
		Assert.strictEqual(
			calc.answer,
			12 * 34,
		);
	});

	it('should calculate a percentage of input', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', '0', '8', '%',
		]);
		Assert.strictEqual(
			calc.answer,
			1.08,
		);
	});

	it('should calculate a percentage of answer', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', '0', '9', '=', '%',
		]);
		Assert.strictEqual(
			calc.answer,
			1.09,
		);
	});

	it('should calculate a percentage of input with buffered operator', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'8', '0', '+', '%',
		]);
		Assert.strictEqual(
			calc.answer,
			0.8,
		);
	});

	it('should operate with percent', () => {
		const calc = new Calculator();

		pushButtons(calc, [
			'2', '0', '0', '+',
			'5', '%',
		]);
		Assert.strictEqual(
			calc.answer,
			210,
			'with `+` operator',
		);

		pushButtons(calc, [
			'c',
			'2', '0', '0', '-',
			'5', '%',
		]);
		Assert.strictEqual(
			calc.answer,
			190,
			'with `-` operator',
		);

		pushButtons(calc, [
			'c',
			'2', '0', '0', '*',
			'5', '%',
		]);
		Assert.strictEqual(
			calc.answer,
			10,
			'with `*` operator',
		);

		pushButtons(calc, [
			'c',
			'2', '0', '0', '/',
			'5', '%',
		]);
		Assert.strictEqual(
			calc.answer,
			4000,
			'with `/` operator',
		);
	});

	it('should invert an answer', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', '2', '=', 'inv',
		]);
		Assert.strictEqual(
			calc.answer,
			-12,
		);
		pushButtons(calc, ['inv']);
		Assert.strictEqual(
			calc.answer,
			12,
		);
	});

	it('should invert an input', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'2', '4', 'inv', '=',
		]);
		Assert.strictEqual(
			calc.answer,
			-24,
		);
	});

	it('should treat single inversion sign as -0', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', 'inv', 'bs',
		]);
		// NOTE:
		// `-0 === 0` is true so have to check the sign of zero as follows
		Assert.strictEqual(
			1 / calc.displayNumber,
			Number.NEGATIVE_INFINITY,
		);

		pushButtons(calc, [
			'+', '4', '=',
		]);
		Assert.strictEqual(
			calc.answer,
			4,
		);
	});

	it('should remain sign', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', 'inv', 'bs', '3', '=',
		]);
		Assert.strictEqual(
			calc.answer,
			-3,
		);
	});

	it('should invert an input with buffered operator', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'3', '6', '*', 'inv',
		]);
		Assert.strictEqual(
			calc.answer,
			-36,
		);
	});

	it('should invert an input buffer only', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', '+', '4', 'inv', '=',
		]);
		Assert.strictEqual(
			calc.answer,
			-3,
		);
	});

	it('should re-invert an input buffer', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', '+', '4', 'inv', 'inv', '=',
		]);
		Assert.strictEqual(
			calc.answer,
			5,
		);
	});

	it('should invert an empty input buffer', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'inv', '=',
		]);
		Assert.strictEqual(
			calc.answer,
			0,
		);
	});

	it('should throw an error by division by zero', () => {
		const calc = new Calculator();
		pushButtons(calc, [
			'1', '2', '3', '/', '0', '=',
		]);
		Assert.strictEqual(
			(calc.error && calc.error.type) || '',
			'specialAnswer',
		);
	});
});
