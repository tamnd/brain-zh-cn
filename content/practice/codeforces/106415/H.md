---
title: "CF 106415H - 草稿表达式"
description: "我们需要计算有多少给定长度的字符串形成一个有效的算术表达式，其值为 0 模 m。 原始字符串由 15 个字符的字母表统一生成：数字、三个二元运算符和两个括号。"
date: "2026-06-25T09:44:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106415
codeforces_index: "H"
codeforces_contest_name: "Winter Cup 8.0 Online Mirror Contest"
rating: 0
weight: 106415
solve_time_s: 44
verified: true
draft: false
---

[CF 106415H - Scratch 表达式](https://codeforces.com/problemset/problem/106415/H)

 **评级：** -
 **标签：** -
 **求解时间：** 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要计算有多少给定长度的字符串构成有效的算术表达式，其值为`0`模数`m`。 原始字符串由 15 个字符的字母表统一生成：数字、三个二元运算符和两个括号。 答案不是计数本身，而是概率，因此在计算有效获胜字符串后，我们除以`15^n`模数`1e9+7`。 

困难在于有效性不仅仅是局部属性。 由于括号错误、运算符没有操作数或算术值不为零，字符串可能会失败。 由于最大长度仅为 200，因此我们可以提供超过长度的动态编程解决方案，但我们必须避免解析单个字符串。 

200 的长度对于多项式动态规划来说足够小。 它排除了枚举，因为有`15^200`可能的字符串，但它允许涉及每个长度和每个残数模的状态`m`。 自从`m`最多为 100，存储每个残基的表达式数量是可行的。 

主要的边缘情况是语法和值相互作用的表达式。 

例如：```
1
```没有运算符并且是一个有效的表达式，但只有当`m = 1`，因为该值为`1`。 

另一个案例：```
(0)
```长度为 3，并且应该算作每个模数的获胜表达式。 仅处理数字和运算符但忘记括号的解决方案会丢失这种情况。 

第三种情况：```
00
```是一个有效的数字，而不是两个表达式。 它的计算结果为零，因此必须对其进行计数。 将连续数字视为单独标记的解析器会拒绝它。 

## 方法

 直接方法将生成每个可能的长度字符串`n`，检查它是否是一个有效的表达式，对其进行评估，并计算获胜者。 这是正确的，因为每个可能的卡片都会被检查，但字符串的数量是`15^n`，即使对于非常小的情况也是不可能的`n`。 

有用的观察是有效的表达式具有语法结构。 我们不需要实际的字符串，只需要每个长度有多少个字符串产生每个可能的残基。 

表达式语法自然分为三个级别。 数字是数字序列。 因子可以是一个数字，也可以是一个带括号的表达式。 项是通过乘法连接的一系列因子。 表达式是通过加法或减法连接的一系列项。 

这符合算术的优先规则，因此每个有效字符串都属于这些类别之一。 

动态规划状态为：`num[len][r]`: 长度数`len`有价值`r`。`fac[len][r]`：长度因子`len`有价值`r`。`term[len][r]`：长度的乘法表达式`len`。`expr[len][r]`：长度的完整表达式`len`。 

转换在第一个操作符处分割较长的对象。 例如，一项可以是一个因素，也可以是一个较小的项，即`*`，还有另一个因素。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(15^n) | O(15^n) | O(n) | 太慢了|
 | 动态规划| O(n²m²) | O(纳米) | 已接受 |

 ## 算法演练

 1. 计算每个长度和余数的数字串的个数。 附加一个数字会转换一个值`x`进入`(10*x+d) mod m`，因此我们可以逐步构建所有数字状态。 
2.构建因素。 因子可以是一个数字，也可以是一个用括号括起来的表达式。 括号添加两个字符，因此是长度的一个因素`i`可以来自长度表达式`i-2`。 
3. 建立条款。 从单一因素开始。 要延长期限，请附加`*`还有另一个因素。 前一项已​​经代表乘法的左侧，因此它自动遵循左结合性。 
4. 构建表达式。 从一个学期开始。 要扩展表达式，请附加`+`或者`-`和另一个术语。 两个运算符都是单独处理的，因为减法会改变所得的残数。 
5. 对于每个要求的长度，取`expr[n][0]`，因为只有残数为零才是获胜牌。 除以字符串总数，`15^n`，使用模逆。 

为什么有效：每个有效的表达式都有一个独特的分解，分解为数字、因子、术语和表达式级别。 转换完全遵循语法规则，因此每个有效字符串都会被计算一次，并且永远不会创建每个无效字符串。 存储的余数正是通过对相应的表达式取模求值而产生的值`m`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def solve_case(m, queries):
    nmax = max(queries)
    
    def conv(a, b, op):
        res = [0] * m
        for i, x in enumerate(a):
            if x:
                for j, y in enumerate(b):
                    if y:
                        if op == 0:
                            k = (i + j) % m
                        else:
                            k = (i * j) % m
                        res[k] = (res[k] + x * y) % MOD
        return res

    num = [[0] * m for _ in range(nmax + 1)]
    num[0][0] = 1
    for length in range(1, nmax + 1):
        for r in range(m):
            if num[length - 1][r]:
                val = num[length - 1][r]
                for d in range(10):
                    num[length][(r * 10 + d) % m] = (
                        num[length][(r * 10 + d) % m] + val
                    ) % MOD

    fac = [[0] * m for _ in range(nmax + 1)]
    term = [[0] * m for _ in range(nmax + 1)]
    expr = [[0] * m for _ in range(nmax + 1)]

    for length in range(1, nmax + 1):
        fac[length] = num[length].copy()
        if length >= 2:
            for r in range(m):
                fac[length][r] = (fac[length][r] + expr[length - 2][r]) % MOD

        term[length] = fac[length].copy()
        for left in range(1, length - 1):
            right = length - left - 1
            add = conv(term[left], fac[right], 1)
            for r in range(m):
                term[length][r] = (term[length][r] + add[r]) % MOD

        expr[length] = term[length].copy()
        for left in range(1, length - 1):
            right = length - left - 1
            plus = conv(expr[left], term[right], 0)
            minus = [0] * m
            for i, x in enumerate(expr[left]):
                if x:
                    for j, y in enumerate(term[right]):
                        if y:
                            minus[(i - j) % m] = (
                                minus[(i - j) % m] + x * y
                            ) % MOD
            for r in range(m):
                expr[length][r] = (
                    expr[length][r] + plus[r] + minus[r]
                ) % MOD

    ans = []
    for n in queries:
        denominator = pow(pow(15, n, MOD), MOD - 2, MOD)
        ans.append(str(expr[n][0] * denominator % MOD))
    return ans

def main():
    t, m = map(int, input().split())
    queries = list(map(int, input().split()))
    print("\n".join(solve_case(m, queries)))

if __name__ == "__main__":
    main()
```代码首先构造数字，因为所有更高的语法级别都依赖于它们。 因子转换使用`expr[length - 2]`，这就是长度从小到大处理的原因。 

乘法和加法层使用残数上的卷积。 对于乘法，新的残数是两个旧残数的乘积。 对于加法和减法，余数是模数的和或差`m`。 

只有在计数完成后才进行最终的概率转换。 分母永远不能被整除`1e9+7`，所以模逆是有效的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n²m²) | 有 O(n²) 次语法分割，每个残差组合的成本为 O(m²)。 |
 | 空间| O(纳米) | 四个动态规划表存储长度和余数。 |

 和`n <= 200`和`m <= 100`，状态空间足够小以满足所需的限制。 

## 边缘情况

 对于单个字符输入长度`1`，唯一有效的表达式是数字。 数字 DP 创建所有十个可能的一位数表达式，并且最终的余数检查仅保留等于零模的那些`m`。 

对于带括号的零，例如`(0)`，因子转换添加`expr[length - 2]`进入因子表。 这正是计算括号数量所需的转换，而不将它们视为算术运算符。 

对于带有前导零的多位数字，例如`00`，数字 DP 附加数字而不限制第一位数字。 所得的残差是正常计算的，因此所有前导零的情况都包括在内。
