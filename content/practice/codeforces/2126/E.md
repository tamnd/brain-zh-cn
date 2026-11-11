---
title: "CF 2126E - G-C-D，不幸！"
description: "我们有两个整数数组 p 和 s，每个数组的长度为 n。 数组p表示某个未知数组a的前缀GCD，数组s表示同一数组的后缀GCD。 任务是判断这样的数组a是否存在。"
date: "2026-06-08T03:23:06+07:00"
tags: ["codeforces", "competitive-programming", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 2126
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1037 (Div. 3)"
rating: 1400
weight: 2126
solve_time_s: 78
verified: true
draft: false
---

[CF 2126E - G-C-D，不幸！](https://codeforces.com/problemset/problem/2126/E)

 **评分：** 1400
 **标签：** 数学，数论
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个整数数组，`p`和`s`，每个长度`n`。 大批`p`表示某个未知数组的前缀 GCD`a`，和数组`s`表示同一数组的后缀 GCD。 任务是判断这样的数组是否`a`存在。 正式来说，如果`a`存在，那么对于每个索引`i`：```
p[i] = gcd(a[1], a[2], ..., a[i])
s[i] = gcd(a[i], a[i+1], ..., a[n])
```输入最多包含 10^4 个测试用例，所有测试用例的总和`n`跨测试用例的值最多为 10^5。 这意味着我们必须在大约 O(n) 时间内有效地处理每个测试用例，因为任何 O(n^2) 都会太慢。 

问题的不明显部分来自于 GCD 传播的限制。 例如前缀GCD数组`p`必须是非递增的，直到第一个元素为 1。同样，`s`从最后一个元素向后必须是非递增的。 一种简单的方法可能会尝试重建所有候选数组`a`并检查它们是否生成给定的`p`和`s`，但这对于大的情况来说是不可行的`n`。 小边缘情况包括数组，其中所有`p`值相等或全部`s`值相等，并且数组`1`其中影响 GCD 传播。 例如，如果`p = [2, 2, 2]`和`s = [2, 2, 1]`，答案是“否”，因为没有一个数组能够同时满足所有位置的前缀和后缀 GCD。 

## 方法

 暴力方法会尝试尝试所有可能的数组`a`符合`p`和`s`。 在每个位置`i`，我们可以尝试任何可以整除的整数`p[i]`和`s[i]`同时满足运行前缀和后缀 GCD。 这原则上是正确的，但速度非常慢，因为可能的数组数量与`n`。 和`n`直到10^5，这种方法并不实用。 

关键的见解是位置的价值`i`在数组中`a`必须是前一个前缀 GCD 的倍数（或`p[i]`本身）和后续后缀 GCD（或`s[i]`）。 具体来说，我们可以定义`a[i]`作为最小公倍数 (LCM)`p[i]`和`s[i]`。 自从`p[i]`划分前缀 GCD 和`s[i]`划分后缀 GCD，选择`a[i] = lcm(p[i], s[i])`确保两个 GCD 都保留在该位置。 构建完这个候选数组后，我们可以重新计算前缀和后缀 GCD 并验证它们是否匹配`p`和`s`。 这将问题简化为线性扫描，每一步都进行简单的算术。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化候选数组`a`长度`n`。 对于每个索引`i`， 放`a[i] = lcm(p[i], s[i])`。 原因是这是可以被两者整除的最小数`p[i]`和`s[i]`，它保留了前缀和后缀 GCD 的必要整除性。 
2. 计算前缀GCD数组`p_check`从`a`。 开始于`p_check[0] = a[0]`，那么对于每个`i`从 1 到`n-1`， 放`p_check[i] = gcd(p_check[i-1], a[i])`。 
3.计算后缀GCD数组`s_check`从`a`。 开始于`s_check[n-1] = a[n-1]`，那么对于每个`i`从`n-2`降至 0，设置`s_check[i] = gcd(s_check[i+1], a[i])`。 
4. 比较`p_check`和`p`和`s_check`和`s`。 如果两个数组完全匹配，则打印“YES”； 否则，打印“NO”。 

为什么它有效：不变的是`lcm(p[i], s[i])`可被索引处的前缀和后缀 GCD 整除`i`。 由于 GCD 具有结合性和交换性，如果候选数组在每个位置都保持整除性，则仅当存在有效数组时，重新计算的前缀和后缀 GCD 才会与原始数组匹配。 任何差异都表明没有这样的数组可以满足两者`p`和`s`同时地。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def main():
    t = int(input())
    for _ in range(t):
        n = int(input())
        p = list(map(int, input().split()))
        s = list(map(int, input().split()))
        a = [0] * n
        for i in range(n):
            a[i] = (p[i] * s[i]) // math.gcd(p[i], s[i])
        p_check = [0] * n
        s_check = [0] * n
        p_check[0] = a[0]
        for i in range(1, n):
            p_check[i] = math.gcd(p_check[i-1], a[i])
        s_check[-1] = a[-1]
        for i in range(n-2, -1, -1):
            s_check[i] = math.gcd(s_check[i+1], a[i])
        if p_check == p and s_check == s:
            print("YES")
        else:
            print("NO")

if __name__ == "__main__":
    main()
```该解决方案使用 LCM 构造候选数组，然后验证前缀和后缀 GCD。 我们使用整数除法来有效地计算 LCM 并避免浮点错误。 自然会处理诸如长度为 1 或值等于 1 的数组之类的边界条件，因为`lcm(x, x) = x`和`gcd(x, x) = x`。 

## 工作示例

 **样品1**

 输入：```
6
72 24 3 3 3 3
3 3 3 6 12 144
```| 我| p[i] | p[i] s[i] | a[i] = lcm(p[i], s[i]) | 前缀 GCD | 后缀 GCD |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 72 | 72 3 | 72 | 72 72 | 72 3 |
 | 1 | 24 | 3 | 24 | 24 | 3 |
 | 2 | 3 | 3 | 3 | 3 | 3 |
 | 3 | 3 | 6 | 6 | 3 | 6 |
 | 4 | 3 | 12 | 12 12 | 12 3 | 12 | 12
 | 5 | 3 | 144 | 144 144 | 144 3 | 144 | 144

 计算前缀和后缀 GCD 后，两者都与输入数组匹配。 输出：是。 

**样品2**

 输入：```
1 2 3
4 5 6
```计算`a[i] = lcm(p[i], s[i])`给出`[4, 10, 6]`。 前缀 GCD：`[4, 2, 2]`不匹配`[1, 2, 3]`。 输出：否。 这表明基于 LCM 的候选保留了可分性约束，并且不匹配检测到不可能性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 构造候选数组并计算前缀/后缀 GCD 是线性的`n`。 |
 | 空间| 每个测试用例 O(n) | 我们存储数组`a`,`p_check`， 和`s_check`。 |

 鉴于所有的总和`n`≤ 10^5，每次测试运行的总操作大约为 3 × 10^5，完全低于 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        main()
    return f.getvalue().strip()

# provided samples
assert run("""5
6
72 24 3 3 3 3
3 3 3 6 12 144
3
1 2 3
4 5 6
5
125 125 125 25 25
25 25 25 25 75
4
123 421 282 251
125 1981 239 223
3
124 521 125
125 121 121
""") == "YES\nNO\nYES\nNO\nNO", "provided samples"

# custom cases
assert run("""1
1
10
10
""") == "YES", "single element, equal"

assert run("""1
3
5 5
```
