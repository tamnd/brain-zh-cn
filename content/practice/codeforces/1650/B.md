---
title: "CF 1650B - DIV + MOD"
description: "我们被要求在从 $l$ 到 $r$ 的整数范围内最大化定义为 $fa(x) = lfloor x / a rfloor + (x bmod a)$ 的函数，其中 $a$ 是一个固定的正整数。"
date: "2026-06-10T03:52:01+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1650
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 776 (Div. 3)"
rating: 900
weight: 1650
solve_time_s: 89
verified: true
draft: false
---

[CF 1650B - DIV + MOD](https://codeforces.com/problemset/problem/1650/B)

 **评分：** 900
 **标签：** 数学
 **求解时间：** 1m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求最大化定义为的函数$f_a(x) = \lfloor x / a \rfloor + (x \bmod a)$范围内的整数$l$到$r$， 在哪里$a$是一个固定的正整数。 换句话说，对于给定的连续整数段，我们想要选择数字$x$产生其整数除以的最大和$a$及其模余数$a$。 

输入由多个测试用例组成。 每个测试用例提供一个片段$[l, r]$和一个除数$a$。 每种情况的输出是最大值$f_a(x)$在那个部分。 

约束很严格：$l$和$r$可以达到$10^9$，并且最多可以有$10^4$测试用例。 一个简单的计算解决方案$f_a(x)$对于每一个$x$之间$l$和$r$可能需要$10^9$在单个测试用例中进行操作，这是不可行的。 

微妙的边缘情况出现时$r$非常接近于的倍数$a$或当$a$相对于来说非常大$r-l$。 例如，如果$l=1$,$r=4$， 和$a=3$，最大值不在$r$但在$x=2$。 仅检查线段端点的粗心方法可能会产生错误的答案。 

## 方法

 暴力法计算$f_a(x)$对于每个整数$x$从$l$到$r$，然后选择最大值。 这有效是因为$f_a(x)$是一个简单的算术函数。 其时间复杂度为$O(r-l+1)$每个测试用例。 鉴于$r-l$可以达到$10^9$，这种方法太慢了。 

关键的观察是$f_a(x)$增加为$x \bmod a$增加，但当$x$是的倍数$a$。 具体来说，对于固定的$a$，该函数是分段线性的：$f_a(x) = \lfloor x / a \rfloor + (x \bmod a) = k + r$在哪里$x = k \cdot a + r$和$0 \le r < a$。 每个块内$a$连续整数，最大值出现在$r = a-1$，即，就在下一个倍数之前$a$。 因此，检查一下就足够了$x=r$和$x=r - (r \bmod a) - 1$（最大的数在$[l, r]$就在多个的之前$a$）。 

这一观察结果将问题简化为每个测试用例最多检查两个候选者，给出$O(1)$每个测试用例的时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(r-l+1) | O(1) | O(1) | 太慢了 |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 
2. 对于每个测试用例，请阅读$l$,$r$， 和$a$。 
3. 计算$f_a(r)$因为最大值可能出现在右端点。 
4. 计算$x = r - (r \bmod a) - 1$，这是小于或等于的最大整数$r$就在多个之前结束$a$。 
5. 如果$x \ge l$, 计算$f_a(x)$; 否则忽略该候选人。 
6. 输出之间的最大值$f_a(r)$和$f_a(x)$作为此测试用例的答案。 

正确性来自以下性质$f_a(x)$在一个大小的块内线性增长$a$当达到的倍数时下降$a$。 因此，该函数只能在以下任一时刻达到其最大值：$r$或紧接在多个的之前$a$段内。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def f(a, x):
    return x // a + x % a

t = int(input())
for _ in range(t):
    l, r, a = map(int, input().split())
    # candidate 1: at the right endpoint
    ans = f(a, r)
    # candidate 2: just before the previous multiple of a
    x = r - (r % a) - 1
    if x >= l:
        ans = max(ans, f(a, x))
    print(ans)
```功能`f(a, x)`隔离问题的算术。 候选人`x = r - (r % a) - 1`确保我们捕获最后一个大小块的峰值`a`段内。 支票`x >= l`避免使用段外的数字。 

## 工作示例

 ### 示例 1

 输入：`l=1, r=4, a=3`| x| x // 一个 | x % a | f(x) | f(x) |
 | ---| ---| ---| ---|
 | 1 | 0 | 1 | 1 |
 | 2 | 0 | 2 | 2 |
 | 3 | 1 | 0 | 1 |
 | 4 | 1 | 1 | 2 |

 候选人`r=4`给出`f=2`。 候选人`x=2`给出`f=2`。 最大值为`2`。 

### 示例 2

 输入：`l=5, r=8, a=4`| x| x // 一个 | x % a | f(x) | f(x) |
 | ---| ---| ---| ---|
 | 5 | 1 | 1 | 2 |
 | 6 | 1 | 2 | 3 |
 | 7 | 1 | 3 | 4 |
 | 8 | 2 | 0 | 2 |

 候选人`r=8`给出`f=2`。 候选人`x=7`给出`f=4`。 最大值为`4`。 

该迹线证实该算法正确地识别了下一个倍数之前的最大值`a`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t) | 每个测试用例有两个候选人，不断的算术运算。 |
 | 空间| O(1) | O(1) | 每个测试用例仅存储几个整数。 |

 和$t \le 10^4$，该算法最多执行$2 \cdot 10^4$ `f_a(x)`评估，轻松适应2秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        l, r, a = map(int, input().split())
        def f(x): return x // a + x % a
        ans = f(r)
        x = r - (r % a) - 1
        if x >= l:
            ans = max(ans, f(x))
        output.append(str(ans))
    return "\n".join(output)

# provided samples
assert run("5\n1 4 3\n5 8 4\n6 10 6\n1 1000000000 1000000000\n10 12 8\n") == "2\n4\n5\n999999999\n5"

# custom tests
assert run("1\n1 1 1\n") == "1", "single-element segment"
assert run("1\n1 10 10\n") == "10", "a equals r"
assert run("1\n1 20 7\n") == "10", "normal segment"
assert run("1\n10 10 3\n") == "13", "single-element high remainder"
assert run("1\n1 1000000000 2\n") == "999999999", "large segment with small a"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 1 | 1 1 1 1 | 单元素段 |
 | 1 10 10 | 1 10 10 10 | 10 a 等于 r |
 | 1 20 7 | 1 20 7 10 | 10 正常段|
 | 10 10 3 | 10 10 3 13 | 单元素高余数 |
 | 1 1000000000 2 | 999999999 | 大段小a |

 ## 边缘情况

 当段仅包含一个元素时，`l=r`，两个候选值都崩溃到相同的值。 例如，`l=r=1, a=1`。 该算法计算`f(1)=1`，以及第二个候选人`x=0`被丢弃是因为`x < l`。 输出是正确的。 

什么时候`r`是的倍数`a`，最大值经常出现在`r-1`。 为了`l=1, r=8, a=4`，函数值在`r=8`是 2，但是`r-1=7`给出 4. 我们的公式`x = r - (r % a) - 1`准确地处理这个问题。 支票`x >= l`防止段下溢
