---
title: "CF 106169A - 博格立方体"
description: "立方体有六个面值：上、下、左、右、前、后。 立方体的每个角恰好接触三个面。 隐藏在拐角处的值被定义为在该拐角处相交的三个面值的乘积。 总共有八个角。"
date: "2026-06-25T11:07:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106169
codeforces_index: "A"
codeforces_contest_name: "2025-2026 ICPC NERC, Kyrgyzstan Regional Contest"
rating: 0
weight: 106169
solve_time_s: 40
verified: true
draft: false
---

[CF 106169A - 博格立方体](https://codeforces.com/problemset/problem/106169/A)

 **评级：** -
 **标签：** -
 **求解时间：** 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 立方体有六个面值：`top, bottom, left, right, front, back`。 

立方体的每个角恰好接触三个面。 隐藏在拐角处的值被定义为在该拐角处相交的三个面值的乘积。 

总共有八个角。 所需的代码是所有八个角的值的总和。 

输入给出六个面值。 我们必须计算八个角乘积的总和。 

限制非常小。 每个面值最多为 500，因此即使直接枚举所有角点也是微不足道的。 最大可能的角值为：`500 × 500 × 500 = 125,000,000`八个这样的值的总和是`1,000,000,000`，它与指定的输出范围匹配。 标准整数算术就足够了。 

唯一微妙的部分是正确识别所有八个角。 每个角必须恰好包含每一对相对的面：

 顶部或底部。 

左或右。 

正面或背面。 

一个常见的错误是不小心错过了一些角或者数了两次。 

考虑：```
1 1 1 1 1 1
```每个角点的值都等于 1，所以答案是：```
8
```如果只计算七个角，结果就变成7。 

另一个容易犯的错误是混淆了相反的面孔。 例如：```
1 2 3 4 5 6
```一个角是`top × left × front = 1 × 3 × 5 = 15`。 

诸如此类的产品`top × bottom × front`无效，因为顶部和底部永远不会在同一个角处相交。 

## 方法

 最直接的解决方案是显式计算所有八个角积并将它们加在一起。 

角点是：`(top,left,front)`

`(top,left,back)`

`(top,right,front)`

`(top,right,back)`

`(bottom,left,front)`

`(bottom,left,back)`

`(bottom,right,front)`

`(bottom,right,back)`这仅需要三个数字的八次乘法和几次加法，这实际上是常数时间。 

还有一个有用的代数观察。 每个角从每一对相对的面中选择一个面。 扩展```
(top + bottom)
× (left + right)
× (front + back)
```恰好生产八个角产品，每个产品出现一次。 

例如，选择`top`从第一个括号开始，`right`从第二个开始，并且`back`从第三个贡献角产品：```
top × right × back
```由于所有八种组合都只出现一次，因此所需的总和很简单：```
(top + bottom)
× (left + right)
× (front + back)
```这将问题转化为单个公式。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力枚举| O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 总和的乘积 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取六个面值：上、下、左、右、前、后。 
2. 计算相对垂直面的总和：```
top + bottom
```3. 计算相对水平面的总和：```
left + right
```4. 计算相对的前后面的总和：```
front + back
```5. 将这三项相乘。 

展开乘积只会生成每个有效角组合一次。 
6. 输出结果。 

### 为什么它有效

 每个角都是通过从每对相对的面中选择一个面来形成的。 这三对是：```
(top, bottom)
(left, right)
(front, back)
```表达式```
(top + bottom)
× (left + right)
× (front + back)
```包含一个术语来代表这三对中的每一种可能的选择。 由于有`2 × 2 × 2 = 8`选择，扩展只包含八个角落产品，仅此而已。 它们的总和正是所需的代码。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

top, bottom, left, right, front, back = map(int, input().split())

answer = (top + bottom) * (left + right) * (front + back)

print(answer)
```直接按照公式执行即可。 

这六个值按照语句指定的顺序读取。 该表达式计算所有角点乘积的总和，而无需明确列出角点。 

因为最大答案最多是`10^9`，Python整数类型很容易处理它。 无需担心索引问题、循环或边界条件。 
## 工作示例
 ### 示例 1
 输入：```
1 2 3 4 4 5
```| 变量| 价值|
 | ---| ---|
 | 顶部+底部| 3 |
 | 左+右| 7 |
 | 正面+背面| 9 |
 | 答案| 3 × 7 × 9 = 189 | 3 × 7 × 9 = 189

 输出：```
189
```这个例子演示了扩展的想法。 值 189 等于所有八个显式计算的角乘积的总和。 

### 示例 2

 输入：```
1 1 1 1 1 1
```| 变量| 价值|
 | ---| ---|
 | 顶部+底部| 2 |
 | 左+右| 2 |
 | 正面+背面| 2 |
 | 答案| 2 × 2 × 2 = 8 |

 输出：```
8
```每个角的乘积都等于 1，并且有八个角，所以答案是 8。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 固定数量的算术运算 |
 | 空间| O(1) | O(1) | 仅存储了几个变量|

 无论输入值如何，该算法都会执行恒定的工作。 它完全符合任何合理的比赛限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    top, bottom, left, right, front, back = map(int, input().split())
    return str((top + bottom) * (left + right) * (front + back))

# provided sample
assert run("1 2 3 4 4 5\n") == "189", "sample 1"

# minimum values
assert run("1 1 1 1 1 1\n") == "8", "all ones"

# asymmetric values
assert run("1 2 3 4 5 6\n") == "231", "general case"

# all maximum values
assert run("500 500 500 500 500 500\n") == "1000000000", "upper bound"

# one large pair, others small
assert run("500 1 1 1 1 1\n") == "2004", "boundary arithmetic"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 1 1 1 1`|`8`| 每个角落都同等贡献 |
 |`1 2 3 4 5 6`|`231`| 一般非对称情况 |
 |`500 500 500 500 500 500`|`1000000000`| 最大可能答案 |
 |`500 1 1 1 1 1`|`2004`| 正确处理不均匀值 |

 ## 边缘情况

 考虑：```
1 1 1 1 1 1
```该算法计算：```
(1 + 1)(1 + 1)(1 + 1)
= 2 × 2 × 2
= 8
```所有八个角点都贡献了 1。结果证实每个角点都被计算一次。 

考虑：```
1 2 3 4 5 6
```该算法计算：```
(1 + 2)(3 + 4)(5 + 6)
= 3 × 7 × 11
= 231
```扩展产品产生八个有效的角产品：```
1·3·5
1·3·6
1·4·5
1·4·6
2·3·5
2·3·6
2·4·5
2·4·6
```它们的总和是 231。没有无效的组合，例如`top × bottom × front`出现在扩展中。 

最后，对于最大允许值：```
500 500 500 500 500 500
```该算法计算：```
1000 × 1000 × 1000
= 1,000,000,000
```它匹配最大可能的答案并安全地保持在整数限制内。
