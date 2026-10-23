---
title: "CF 1208A - XORinacci"
description: "我们被要求计算一个类似于斐波那契数的序列，但不是对前两项求和，而是通过对前两项应用按位异或运算来获得每一项。"
date: "2026-06-11T23:23:49+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1208
codeforces_index: "A"
codeforces_contest_name: "Manthan, Codefest 19 (open for everyone, rated, Div. 1 + Div. 2)"
rating: 900
weight: 1208
solve_time_s: 88
verified: true
draft: false
---

[CF 1208A - XORinacci](https://codeforces.com/problemset/problem/1208/A)

 **评分：** 900
 **标签：** 数学
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算一个类似于斐波那契数的序列，但不是对前两项求和，而是通过对前两项应用按位异或运算来获得每一项。 形式上，序列由两个初始整数定义`a`和`b`作为`f(0) = a`,`f(1) = b`，并且对于`n > 1`,`f(n) = f(n-1) XOR f(n-2)`。 给定多个测试用例，每个测试用例指定`a`,`b`， 和`n`，我们要计算`f(n)`对于每种情况。 

约束表明`a`,`b`， 和`n`每个最多可以有 10 亿个，并且最多可以有 1000 个测试用例。 一种简单的方法，迭代计算序列直至`n`当`n`很大，因为每个测试用例迭代十亿次是不可行的。 

非明显的边缘情况是`n`非常小，特别是`n = 0`或者`n = 1`。 粗心的方法可能会从以下开始迭代`0`并假设至少两次迭代，产生越界或未定义的结果。 另一个微妙的案例非常大`n`暴力方法不会在合理的时间内终止。 

## 方法

 暴力方法将简单地用前两个元素初始化一个数组`a`和`b`，然后通过对前两个元素进行异或来迭代计算每个下一个元素。 这种方法保证产生正确的答案，因为它忠实地遵循序列定义。 然而，在最坏的情况下`n`接近 10^9，这需要 10^9 次迭代，考虑到 1 秒的时间限制，这太慢了。 

解锁快速解决方案的关键观察结果是 XORinacci 数是周期性的，周期长度为 3。具体来说，该序列在模式中每三项重复一次`[a, b, a XOR b, a, b, a XOR b, ...]`。 发生这种情况是因为 XOR 运算具有以下属性：`(x XOR y) XOR x = y`，导致可预测的重复。 一旦识别出这种模式，我们就可以计算`f(n)`在恒定时间内通过采取`n modulo 3`并索引到模式中。 

方法的比较是：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) | O(1) | O(1) | 对于大 n 来说太慢 |
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取整数`a`,`b`， 和`n`。 
2. 计算`n_mod = n % 3`。 这确定了位置`f(n)`在重复的三项模式内。 
3.如果`n_mod`是 0，`f(n)`是`a`。 如果`n_mod`是 1，`f(n)`是`b`。 否则，`f(n)`是`a XOR b`。 
4. 打印每个测试用例的计算值。 

这是有效的，因为 XORinacci 序列遵循循环`[a, b, a XOR b]`无限期地。 例如，从`[a, b]`，下一项是`a XOR b`， 然后`(a XOR b) XOR b = a`， 然后`a XOR (a XOR b) = b`，这证实了重复。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

T = int(input())
for _ in range(T):
    a, b, n = map(int, input().split())
    n_mod = n % 3
    if n_mod == 0:
        print(a)
    elif n_mod == 1:
        print(b)
    else:
        print(a ^ b)
```该解决方案首先读取测试用例的数量。 对于每个测试用例，它读取`a`,`b`， 和`n`。 使用模 3，它确定了哪个元素`[a, b, a XOR b]`周期对应于`f(n)`。 这`^`Python 中的运算符计算按位异或。 模数确保我们只对每个测试用例执行恒定时间计算，并且算法处理`n = 0`和`n = 1`自然无需额外检查。 

## 工作示例

 **样本1**：`a=3, b=4, n=2`| 步骤| 计算| 结果 |
 | ---| ---| ---|
 | n % 3 | 2%3| 2 |
 | 模式[2] | a 异或 b = 3 ^ 4 | 7 |

 该表证实了`f(2)`是`7`正如预期的那样。 

**样本2**：`a=4, b=5, n=0`| 步骤| 计算| 结果 |
 | ---| ---| ---|
 | n % 3 | 0 % 3 | 0 |
 | 模式[0] | a = 4 | 4 |

 这表明`f(0)`正确返回初始值`a`。 

**样本3**：`a=325, b=265, n=1231232`| 步骤| 计算| 结果 |
 | ---| ---| ---|
 | n % 3 | 1231232 % 3 | 2 |
 | 模式[2] | 异或 b = 325 ^ 265 | 76 | 76

 这表明该解决方案可以处理非常大的数据`n`无需迭代。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(T)| 每个测试用例都需要一个模数和异或运算，恒定时间。 |
 | 空间| O(1) | O(1) | 只需要几个变量，不需要与 n 成比例的数组。 |

 给定`T <= 1000`，总工作量约为 1000 个恒定时间操作，可以在 1 秒内轻松完成，并且远低于 256 MB 的内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    T = int(input())
    for _ in range(T):
        a, b, n = map(int, input().split())
        n_mod = n % 3
        if n_mod == 0:
            print(a)
        elif n_mod == 1:
            print(b)
        else:
            print(a ^ b)
    return output.getvalue().strip()

# provided samples
assert run("3\n3 4 2\n4 5 0\n325 265 1231232\n") == "7\n4\n76", "sample 1"

# custom cases
assert run("1\n0 0 0\n") == "0", "minimum values"
assert run("1\n0 0 1\n") == "0", "small n=1"
assert run("1\n1 1 2\n") == "0", "XOR zero result"
assert run("1\n1000000000 1000000000 1000000000\n") == "0", "large values"
assert run("3\n5 7 3\n5 7 4\n5 7 5\n") == "5\n7\n2", "sequence cycle"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`0 0 0`|`0`| 最小值边缘情况 |
 |`0 0 1`|`0`| 小的`n=1`边缘情况 |
 |`1 1 2`|`0`| XOR 产生零 |
 |`10^9 10^9 10^9`|`0`| 数量大、数量大`n`|
 |`5 7 3`/`4`/`5`|`5 / 7 / 2`| 确认循环模式处理 |

 ## 边缘情况

 对于`n = 0`, 模运算`0 % 3 = 0`正确选择`a`。 例如，使用输入`0 0 0`，算法计算`n_mod = 0`和打印`0`。 为了`n = 1`,`1 % 3 = 1`选择`b`。 大的`n`喜欢`1231232`减少到`1231232 % 3 = 2`，返回`a XOR b`。 The modulo cycle avoids any need for loops or recursion, handling extreme inputs efficiently and correctly.
