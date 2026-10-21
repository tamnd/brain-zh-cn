---
title: "CF 1133D - 零数量最大化"
description: "我们有两个整数数组 a 和 b，每个数组有 n 个元素。 我们被要求使用单个实数 d 构造一个新数组 c，使得每个元素 ci 等于 d ai + bi。 我们的目标是选择 d 来最大化 c 中零的数量。"
date: "2026-06-12T04:05:05+07:00"
tags: ["codeforces", "competitive-programming", "hashing", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1133
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 544 (Div. 3)"
rating: 1500
weight: 1133
solve_time_s: 73
verified: true
draft: false
---

[CF 1133D - 零数量最大化](https://codeforces.com/problemset/problem/1133/D)

 **评分：** 1500
 **标签：** 哈希、数学、数论
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个整数数组，`a`和`b`，每个都有`n`元素。 我们被要求构造一个新数组`c`使用单个实数`d`这样每个元素`c_i`等于`d * a_i + b_i`。 我们的目标是选择`d`最大化零的数量`c`。 输出是可实现的最大零元素数`c`。 

限制因素很大。`n`最多可达 200,000，并且`a_i`和`b_i`每个的绝对值可以大到 10^9。 这排除了任何检查所有可能的解决方案`d`显式值或尝试嵌套循环中的所有对。 该算法必须在大致线性或线性算数时间内运行`n`。 

当某些情况出现时，就会出现微妙的边缘情况`a_i`值为零。 在那种情况下，`c_i = b_i`独立于`d`，所以我们只能在该位置得到零，如果`b_i`本身为零。 另一个重要的情况是当多对`(a_i, b_i)`产生相同的比率`-b_i / a_i`。 这些都将有助于实现相同的最佳效果`d`。 忽略精度或错误地减少分数的粗心实现可能会错误计算这些。 

小例子：`a = [0, 2], b = [0, 4]`。 这里，第一个元素已经为零，无论`d`。 当第二个元素变为零时`d = -2`。 最优的`d`是`-2`我们得到两个零。 一种忽略零的幼稚方法`a_i = 0`只会计算一个零。 

## 方法

 蛮力方法是考虑每一个真实的`d`这可能会让一些`c_i`零，然后计算零`d`。 观察到`c_i = 0`意味着`d = -b_i / a_i`（什么时候`a_i ≠ 0`），一个简单的算法可能会尝试测试所有这些候选者`d`值和计数零`O(n^2)`时间。 这原则上是正确的，但太慢了：对于`n = 2 * 10^5`，可能需要 4 * 10^10 次操作。 

关键的观察是`d`由比率唯一确定`-b_i / a_i`。 如果多个指数产生相同的比率，则选择该比率`d`使所有对应`c_i`同时归零。 因此，我们只需要计算每个独特比率出现的次数即可。 分数必须以简化形式存储以避免浮点不准确。 零对`(a_i = 0, b_i = 0)`可以单独计算，因为它们对于任何`d`。 

这将问题简化为对这些分数进行散列并计算出现次数。 每个分数可以表示为`(numerator, denominator)`使用最大公约数的简化形式，同时确保分母为正以保持一致性。 一旦我们有了计数，最大频率加上`a_i = 0, b_i = 0`给出了答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 最佳 | O(n log(max( | a_i | , |

 ## 算法演练

 1.初始化一个计数器`ratio_count`存储每个约简分数的频率`-b_i / a_i`。 同时初始化`zero_count`计算位置，其中`a_i = 0`和`b_i = 0`。 
2. 迭代每一对`(a_i, b_i)`。 如果`a_i`为零并且`b_i`为零，增量`zero_count`。 如果`a_i`为零并且`b_i`不为零，跳过它，因为不`d`可以使这个为零。 
3. 对于非零`a_i`，计算分数`-b_i / a_i`。 使用最大公约数将此分数简化为最简单的形式。 标准化符号，使分母为正，确保散列一致。 
4. 使用元组`(numerator, denominator)`作为柜台的钥匙`ratio_count`并增加该键的计数。 
5. 最终答案为最大计数`ratio_count`加`zero_count`。 如果`ratio_count`为空（全部`a_i = 0`），答案是`zero_count`。 

为什么有效：每个分数恰好代表一个候选人`d`这使得相应的`c_i`零。 通过计算每个候选人的次数`d`发生时，我们发现`d`最大化零。 零元素独立于`d`分别添加。 没有遗漏任何候选人，也没有因标准化而重复计算任何分数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from math import gcd
from collections import Counter

n = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))

ratio_count = Counter()
zero_count = 0

for ai, bi in zip(a, b):
    if ai == 0:
        if bi == 0:
            zero_count += 1
        continue
    num = -bi
    den = ai
    g = gcd(num, den)
    num //= g
    den //= g
    if den < 0:
        num = -num
        den = -den
    ratio_count[(num, den)] += 1

max_ratio = max(ratio_count.values(), default=0)
print(max_ratio + zero_count)
```该解决方案首先处理零，其中`a_i = 0`。 然后，它会仔细地减少分数并规范化符号以确保密钥一致。 使用`Counter`有效地跟踪频率。 决赛`max`调用找到最佳候选者`d`。 

## 工作示例

 样本1：

 输入：```
5
1 2 3 4 5
2 4 7 11 3
```| 我| a_i | b_i | num=-b_i | 登=a_i | 减少| 比例计数 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 2 | -2 | 1 | (-2,1) | (-2,1) | 1 |
 | 2 | 2 | 4 | -4 | 2 | (-2,1) | (-2,1) | 2 |
 | 3 | 3 | 7 | -7 | 3 | (-7,3) | (-7,3) | 1 |
 | 4 | 4 | 11 | 11 -11 | 4 | (-11,4) | (-11,4) | 1 |
 | 5 | 5 | 3 | -3 | 5 | (-3,5) | 1 |`zero_count = 0`,`max_ratio = 2`， 输出`2`。 这证实了选择`d = -2`将前两个位置归零。 

样本2：

 输入：```
3
0 1 2
0 3 6
```| 我| a_i | b_i | 零计数 | 比例计数 |
 | ---| ---| ---| ---| ---|
 | 1 | 0 | 0 | 1 | - |
 | 2 | 1 | 3 | 0 | (-3,1)=1 | (-3,1)=1 |
 | 3 | 2 | 6 | 0 | (-3,1)=2 | (-3,1)=2 |`zero_count=1`,`max_ratio=2`， 输出`3`。 分数计数加零处理工作正常。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log(max( | a_i |
 | 空间| O(n) | 我们在计数器中最多存储 n 个独特的分数。 |

 与`n ≤ 2 * 10^5`，时间复杂度在2秒以内可以接受。 内存使用呈线性，完全在 256 MB 限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    from math import gcd
    from collections import Counter
    ratio_count = Counter()
    zero_count = 0
    for ai, bi in zip(a, b):
        if ai == 0:
            if bi == 0:
                zero_count += 1
            continue
        num, den = -bi, ai
        g = gcd(num, den)
        num //= g
        den //= g
        if den < 0:
            num = -num
            den = -den
        ratio_count[(num, den)] += 1
    max_ratio = max(ratio_count.values(), default=0)
    return str(max_ratio + zero_count)

# provided samples
assert run("5\n1 2 3 4 5\n2 4 7 11 3\n") == "2", "sample 1"
assert run("3\n0 1 2\n0 3 6\n") == "3", "custom zero + fraction overlap"
# minimum-size input
assert run("1\n0\n0\n") == "1", "single zero"
assert run("1\n1\n2\n") == "1", "single non
```
