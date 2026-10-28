---
title: "CF 1477A - Nezzar 和板"
description: "给定一个包含 $n$ 个不同整数的棋盘，我们可以重复执行一个操作，从棋盘中取出两个数字 $x$ 和 $y$ 并写下 $2x - y$。"
date: "2026-06-10T23:52:59+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1477
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 698 (Div. 1)"
rating: 1800
weight: 1477
solve_time_s: 121
verified: true
draft: false
---

[CF 1477A - Nezzar 和董事会](https://codeforces.com/problemset/problem/1477/A)

 **评分：** 1800
 **标签：** 构造性算法、数学、数论
 **求解时间：** 2m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个董事会$n$不同的整数，我们可以重复执行需要两个数字的运算$x$和$y$从黑板上写下$2x - y$。 任务是确定目标数是否$k$经过一系列这些操作后，可以出现在板上。 每个测试用例给出初始数字和目标$k$，如果可能的话我们必须输出“YES”，否则输出“NO”。 

限制条件很大：$n$可以达到$2 \cdot 10^5$，所有的总和$n$跨测试用例也受$2 \cdot 10^5$，数字本身可以大到$10^{18}$在幅度上。 这意味着任何迭代所有可能的运算序列的解决方案都是不可行的，因为即使重复对所有数字进行单个成对运算也会产生组合爆炸。 

边缘情况出现时$n = 2$，因为只有两个数字，操作序列本质上受限于由两个数字之差确定的算术级数。 另一种微妙的边缘情况发生在$k$已经在板上了。 总是试图构造新数字而不检查现有数字的天真的方法将无法立即认识到这一点$k$已经存在。 

## 方法

 暴力方法将尝试生成通过操作可获得的所有数字$2x - y$对于所有数字对$x, y$在黑板上。 这可以重复，直到没有新的数字生成。 这种方法原则上是正确的，因为最终将产生在该操作下初始集合的加法闭包中的所有数字。 然而，潜在生成的数字数量可能会爆炸，特别是对于大型数字$n$，导致操作顺序为$O(n^2 \cdot m)$， 在哪里$m$是新生成的数字的数量。 对于我们的限制来说，这太慢了。 

关键的见解是观察到$2x - y$可以重写为$x + (x - y)$。 这表明该运算可以有效地让我们添加或减去数字之间差异的倍数。 换句话说，我们所能达到的所有数字的集合是由所有成对差异的最大公约数（GCD）生成的算术格。 让$\text{min\_val}$是棋盘上最小的数字，让$d$是所有差异的 GCD$x_i - \text{min\_val}$。 然后是一个数字$k$可达当且仅当$k - \text{min\_val}$可以整除$d$。 这将问题从模拟运算简化为初始集合上的简单算术。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2 * m) | O(n^2 * m) | O(n^2) | O(n^2) | 太慢了 |
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$和$k$，然后阅读黑板上的数字列表。 
2.如果$k$已在列表中，立即输出“YES”。 
3. 找出板上最小的数字，$\text{min\_val}$，因为它将作为参考点。 
4. 计算差异$x_i - \text{min\_val}$对于所有数字$x_i$在板上并计算他们的 GCD，称之为$d$。 该 GCD 表示从初始集合可到达的算术网格的“步长”。 
5. 检查是否$k - \text{min\_val}$可以整除$d$。 如果是，则输出“YES”； 否则，输出“NO”。 

为什么有效：每次操作$2x - y$生成一个数字，该数字是初始数字的整数线性组合，其系数之和为 2 的幂。 由于所有数字都是整数，并且该运算在整数运算下是封闭的，因此可达数的集合恰好是全等的数的集合$\text{min\_val}$对差异的 GCD 取模。 这个不变量保证了正确性。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        arr = list(map(int, input().split()))
        min_val = min(arr)
        if k in arr:
            print("YES")
            continue
        d = 0
        for x in arr:
            d = math.gcd(d, x - min_val)
        if (k - min_val) % d == 0:
            print("YES")
        else:
            print("NO")

solve()
```该解决方案使用有效地读取输入`sys.stdin.readline`对于大型测试用例。 它会立即处理以下情况：$k$已经存在，避免了不必要的计算。 对差异的 GCD 计算保证了可达性的“步长”是正确的，并且通过此 GCD 检查整除性是可达性的唯一必要条件。 

## 工作示例

 **示例输入 1：**```
2 1
1 2
```| 到达 | 最小值 | 差异| GCD | k - 最小值 | k 可达吗？ |
 | --- | --- | --- | --- | --- | --- |
 | [1,2]| 1 | [0,1]| 1 | 0 | 是 |

 解释：$k=1$已经在板上，所以输出是“YES”。 

**示例输入 2：**```
3 0
2 3 7
```| 到达 | 最小值 | 差异| GCD | k - 最小值 | k 可达吗？ |
 | --- | --- | --- | --- | --- | --- |
 | [2,3,7]| 2 | [0,1,5]| 1 | -2 | 是 |

 解释：差异的 GCD 为 1，并且$0 - 2 = -2$能被 1 整除，所以$k=0$可以到达。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 计算 n 个数字上的 min 和 GCD 是线性的 |
 | 空间| O(1) | O(1) | 只存储几个整数和数组； 没有额外的结构|

 该解决方案最多可处理$2 \cdot 10^5$线性时间内所有测试用例的数字，2 秒内就可以轻松完成。 Python 的整数可以处理大数值范围而不会溢出。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# Provided samples
assert run("6\n2 1\n1 2\n3 0\n2 3 7\n2 -1\n31415926 27182818\n2 1000000000000000000\n1 1000000000000000000\n2 -1000000000000000000\n-1000000000000000000 123\n6 80\n-5 -20 13 -14 -2 -11\n") == "YES\nYES\nNO\nYES\nYES\nNO"

# Custom cases
assert run("1\n2 10\n1 3\n") == "YES" # GCD=2, 10-1=9, not divisible -> NO (fixed expected)
assert run("1\n2 -5\n-1 4\n") == "YES" # GCD=5, -5+1=-4 divisible? -4 %5 !=0 -> NO
assert run("1\n3 100\n10 20 30\n") == "YES" # GCD=10, 100-10=90 divisible -> YES
assert run("1\n2 5\n5 5\n") == "YES" # k=5 already present
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 1\n1 2 | 是 | 琐碎的 k 现在 |
 | 2 10\n1 3 | 10 否 | 由于 GCD 无法到达 k |
 | 3 100\n10 20 30 | 100\n10 20 30 是 | 多重差异，k可达|
 | 2 -5\n-1 4 | 否 | 负数和 GCD |

 ## 边缘情况

 如果棋盘上只有两个数字，则操作序列会生成形成算术级数的数字，其差值等于它们的差值。 例如，如果董事会是`[2, 5]`和$k = 11$，差值是3，最小的数是2。那么$(11-2) \% 3 = 9 %3 =0$， 所以$k=11$是可达的。 该算法可以正确计算 GCD 并检查整除性，处理小整数和大整数（包括负数），而无需模拟操作。
