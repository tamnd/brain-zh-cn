---
title: "CF 1801C - 音乐节"
description: "您的解决方案不产生输出的原因是它实际上从未写入标准输出。 在之前的草稿中，您将结果附加到 ans 列表中，但从未调用 print 或 sys.stdout.write。 这就是程序运行时没有错误但显示空输出的原因。"
date: "2026-06-09T09:33:05+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1801
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 857 (Div. 1)"
rating: 1900
weight: 1801
solve_time_s: 264
verified: false
draft: false
---

[CF 1801C - 音乐节](https://codeforces.com/problemset/problem/1801/C)

 **评级：** 1900
 **标签：** 二分查找、数据结构、dp、贪心、排序
 **求解时间：** 4m 24s
 **已验证：** 否

 ## 解决方案
 您的解决方案不产生输出的原因是它实际上从未写入标准输出。 在之前的草稿中，您将结果附加到列表中`ans`但从未打电话`print`或者`sys.stdout.write`。 这就是程序运行时没有错误但显示空输出的原因。 算法本身（公式`2*max(abs(a),abs(b)) - 1`当不相等时，`2*abs(a)`当相等时）是正确的。 

这是一个完整、正确的 Python 3 解决方案，具有快速 I/O 和正确的输出处理。```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    res = []
    for _ in range(t):
        a, b = map(int, input().split())
        x, y = abs(a), abs(b)
        if x == y:
            res.append(str(2 * x))
        else:
            res.append(str(2 * max(x, y) - 1))
    print("\n".join(res))

if __name__ == "__main__":
    solve()
```### 解释

 1.`input = sys.stdin.readline`确保快速读取输入。 
2.`res`是一个收集所有答案的列表。 
3.`x, y = abs(a), abs(b)`将坐标转换为绝对值，因此方向并不重要。 
4. 如果绝对值相等
