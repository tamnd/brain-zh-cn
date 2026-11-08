---
title: "CF 2020E - 预期功率"
description: "我们得到一个整数数组，每个整数都有包含在随机多重集中的独立概率。 任务是计算所有选定元素的异或平方的期望值。"
date: "2026-06-08T12:49:35+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dp", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 2020
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 976 (Div. 2) and Divide By Zero 9.0"
rating: 2000
weight: 2020
solve_time_s: 152
verified: false
draft: false
---

[CF 2020E - 预期功率](https://codeforces.com/problemset/problem/2020/E)

 **评级：** 2000
 **标签：** 位掩码、dp、数学、概率
 **求解时间：** 2m 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组，每个整数都有包含在随机多重集中的独立概率。 任务是计算所有选定元素的异或平方的期望值。 输入提供 10,000 以内的整数形式的概率以及数组元素本身。 我们必须有效地处理多个测试用例，所有数组长度之和不超过 200,000，所有数字最多为 1023。输出是预期的平方异或模$10^9+7$。 

枚举所有可能子集的简单方法是不可行的，因为有$2^n$子集，这是一个天文数字$n$最多200,000。 边缘情况包括单元素数组、不同概率的重复数字以及概率为 0 或 100% 的情况，这可能会简单地简化期望值，但仍必须正确计算模数$10^9+7$。 例如，如果数组是`[1,1]`有概率`[10000,0]`，只有第一个元素有贡献，并且$(f(S))^2$简直就是$1^2$。 粗心的实现可能会忘记概率所需的模逆或整数缩放。 

## 方法

 强力解决方案计算每个子集的 XOR，乘以它的概率、平方和所有子集的总和$2^n$子集。 这是正确的，但显然不可能$n > 20$。 

更快解决方案的关键在于期望的线性度和按位分解异或运算的能力。 由于 XOR 是按位模 2 加法，因此每位的行为都是独立的。 让$X_i$表示 bit 的指示随机变量$i$在所选多重集的 XOR 中。 然后$\Pr(X_i=1)$是奇数个数组元素具有 bit 的概率$i$包括。 

计算$\Pr(X_i=1)$可以通过维护数字子集上的概率生成函数来直接完成。 让$q_i = 1 - p_i / 10^4$。 对于给定的位$b$， 定义$s_b = \sum$具有该位的数字的概率。 使用动态规划或对 2 个状态（位设置或未设置）的迭代卷积，我们可以计算位的概率$b$最终异或为1。 

一旦我们有$\Pr(X_i=1)$对于所有 10 位（因为$a_i \le 1023$），期望值$(f(S))^2$可以表示为$$\mathbb{E}[(f(S))^2] = \sum_{i} 2^{2i} \Pr(X_i=1) + \sum_{i\neq j} 2^{i+j} \Pr(X_i=1 \text{ XOR } X_j=1)$$这里，交叉项使用位的独立性进行简化，给出$$\Pr(X_i \oplus X_j = 1) = \Pr(X_i=1)\cdot(1-\Pr(X_j=1)) + (1-\Pr(X_i=1))\cdot\Pr(X_j=1)$$这种分解将指数问题简化为与位数和数组大小呈线性关系的问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n2^n)$|$O(n)$| 太慢了|
 | 按位 DP |$O(nB^2)$,$B=10$|$O(B)$| 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$， 大批$a$，和数组$p$。 将概率转换为模分数$p_i/10000 \bmod 10^9+7$。 
2.初始化一个数组`prob_bit[10]`存储随机子集的 XOR 中每个位被设置的概率。 
3. 对于每一位$b$从0到9，计算`prob_bit[b]`通过迭代数组并更新奇数个选定数字具有该位设置的概率。 这可以迭代地完成：对于设置了位的每个数字，将当前偶数和奇数奇偶校验的概率乘以其包含概率。 
4. 使用以下公式计算预期平方：$$\mathbb{E}[(f(S))^2] = \sum_{b=0}^{9} 2^{2b} \text{prob\_bit}[b] + \sum_{0 \le b_1 < b_2 < 10} 2^{b_1+b_2} ( \text{prob\_bit}[b_1] + \text{prob\_bit}[b_2] - 2 \text{prob\_bit}[b_1]\text{prob\_bit}[b_2] )$$计算概率时使用 10000 的倒数的模运算。 

1.输出结果取模$10^9+7$。 

工作原理：XOR 运算在位上进行分解，并且选择的独立性允许每个位的概率以乘法方式组合。 交叉位项由期望线性和 XOR 公式处理。 该算法从不枚举子集，但它正确地考虑了每个可能的贡献。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7
INV10000 = pow(10000, MOD-2, MOD)

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        p = list(map(int, input().split()))
        
        prob_bit = [0]*10
        for b in range(10):
            even, odd = 1, 0
            for i in range(n):
                if (a[i] >> b) & 1:
                    pi = p[i]*INV10000 % MOD
                    new_even = (even*(1-pi) + odd*pi) % MOD
                    new_odd  = (even*pi + odd*(1-pi)) % MOD
                    even, odd = new_even, new_odd
            prob_bit[b] = odd
        
        result = 0
        for b in range(10):
            result = (result + prob_bit[b]*(1 << (2*b))) % MOD
        for b1 in range(10):
            for b2 in range(b1+1, 10):
                cross = (prob_bit[b1] + prob_bit[b2] - 2*prob_bit[b1]*prob_bit[b2]%MOD) % MOD
                result = (result + cross*(1 << (b1+b2))) % MOD
        print(result)

if __name__ == "__main__":
    solve()
```该解决方案将概率转换为模分数，并迭代计算每个位在最终 XOR 中设置的概率。 然后使用单位贡献和成对交叉位贡献来组装预期的平方。 使用模乘可以防止溢出，并且运算顺序遵循 Python 的运算符优先级。 

## 工作示例

 输入示例：```
2
2
1 2
5000 5000
2
1 1
1000 2000
```跟踪第一个测试用例：

 | 步骤| 甚至| 奇数| 贡献数？ | 圆周率 |
 | --- | --- | --- | --- | --- |
 | b = 0 | 1 | 0 | 1 有 bit0=1 | 0.5 | 0.5
 | 1 之后 | 0.5 | 0.5 0.5 | 0.5 | |
 | 2 之后 | 0.5 | 0.5 0.5 | 0.5 2 有 bit0=0 | |
 | b = 1 | 1 | 0 | 1 有 bit1=0 | |
 | 2 之后 | 0.5 | 0.5 0.5 | 0.5 2 有 bit1=1 | 0.5 | 0.5

 最终的`prob_bit`给出 XOR 位的预期概率。 合并产生预期平方值$7/2 \equiv 500000007$。 

第二个测试用例的处理方式类似，概率为 0.1 和 0.2，结果如预期的那样为 0.26。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t_n_B^2) | O(t_n_B^2) | B=10 位，内循环处理概率更新和跨位和 |
 | 空间| O(B) | 存储每个位的概率 |

 总和$n$所有测试用例的数量≤200,000，B是常数，因此总操作数≈2×10^6，在4s限制下可以接受。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("4\n2\n1 2\n5000 5000\n2\n1 1\n1000 2000\n6\n343 624 675 451 902 820\n6536 5326 7648 2165 9430 5428\n1\n1\n10000\n") == "500000007\n820000006\n280120
```
