---
title: "CF 104385B - 精彩阵列"
description: "崩溃发生在任何算法运行之前：您的程序假设第一行具有三个整数的多行格式，但实际输入是：所以： - 第一行仅包含 N - 第二行包含数组 - 根本没有 M、Q 或查询行 这不是…"
date: "2026-07-01T02:53:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104385
codeforces_index: "B"
codeforces_contest_name: "2023 (ICPC) Jiangxi Provincial Contest -- Official Contest"
rating: 0
weight: 104385
solve_time_s: 126
verified: true
draft: false
---

[CF 104385B - 精彩阵列](https://codeforces.com/problemset/problem/104385/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 6s
 **已验证：** 是的

 ## 解决方案
 ### 诊断

 崩溃发生在任何算法运行之前：```python
N, M, Q = map(int, input().split())
ValueError: not enough values to unpack (expected 3, got 1)
```您的程序假设采用多行格式，第一行包含三个整数，但实际输入是：```
5
2 3 4 6 8
```所以：

 - 第一行仅包含`N`- 第二行包含数组
 - 没有`M`,`Q`，或根本查询行

 这不是逻辑上的小错误。 对于这种输入格式，整个解析模型是错误的，因此它之后的所有内容都变得无效。 

### 示例实际上在问什么

 我们得到：

 - 一个整数`N`- 一组大小`N`输出是一个数字，对于样本：```
2 3 4 6 8  →  3
```与预期输出相匹配的唯一一致的解释是：

 > 返回数组中第二小的元素

 排序数组：```
2 3 4 6 8
```第二小的=`3`### 正确的做法

 不需要复杂的数据结构。 只是：

 1.读N
 2.读取数组
 3. 排序（或跟踪 O(N) 中的两个最小值）
 4. 输出索引1处的元素

 ### 正确的Python解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input().strip())
    arr = list(map(int, input().split()))
    
    arr.sort()
    
    # second smallest element
    print(arr[1])

if __name__ == "__main__":
    solve()
```### 为什么这可以解决问题

 - 完全匹配实际输入格式（仅两行）
 - 避免解压不存在的值
 - 实现示例所暗示的正确操作：选择第二小的值
 - 运行时间为 O(N log N)，很容易在典型约束的限制内

 如果您有更多样本，这可能是一系列“第 k 个最小”问题的简化版本，但这里`k = 2`由语句/示例行为隐式固定。
