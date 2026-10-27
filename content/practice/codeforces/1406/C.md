---
title: "CF 1406C - 链接切割质心"
description: "问题实际上不在于算法。 输出显示为： 表示程序根本没有产生任何输出。 这表明存在实施问题，而不是数学问题。"
date: "2026-06-11T08:02:23+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "graphs", "trees"]
categories: ["algorithms"]
codeforces_contest: 1406
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 670 (Div. 2)"
rating: 1700
weight: 1406
solve_time_s: 492
verified: false
draft: false
---

[CF 1406C - 链接切割质心](https://codeforces.com/problemset/problem/1406/C)

 **评分：** 1700
 **标签：** 构造性算法、dfs 和类似算法、图形、树
 **求解时间：** 8m 12s
 **已验证：** 否

 ## 解决方案
 问题实际上不在于算法。 输出显示为：```

```意味着程序根本没有产生任何输出。 这表明存在实施问题，而不是数学问题。 

查看前面的代码，示例测试工具包含：```python
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    ...
```但解决方案本身是作为顶级代码编写的：```python
t = int(input())
for _ in range(t):
    ...
```如果该代码被复制到期望的环境中`solve()`函数，或者与测试工具混合，它很容易导致什么都不执行。 

更重要的是，数学方法是正确的：

 让```
x = a & b
```然后```
(a xor x) + (b xor x)
```被最小化，并且它简化为```
a xor b
```因为两个数字的每一位都有一个`1`可以同时消除。 

例如：```
a = 6  = 0110
b = 12 = 1100

a xor b = 1010 = 10
```与样本相匹配。 

因此，一个更简单、更直接的解决方案就是：```
answer = a xor b
```## 正确的 Python 3 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        a, b = map(int, input().split())
        print(a ^ b)

solve()
```### 样品验证

 输入：```
6
6 12
4 9
59 832
28 14
4925 2912
1 1
```输出：```
10
13
891
18
6237
0
```这与预期的输出完全匹配。 

＃＃＃ 为什么`a ^ b`就是答案

 对于每个位独立：

 - 如果两个位都是`0`，贡献是`0`。 
- 如果两个位都是`1`，选择对应位`x`作为`1`，同时做出贡献`0`。 
- 如果位不同，则其中之一`(a xor x)`和`(b xor x)`无论选择什么，都必须包含该位`x`，所以贡献正是该位值。 

因此只有位置`a`和`b`差异仍保留在最小总和中。 这些位置正是设置的位`a ^ b`。 

所以：```
min_x ((a xor x) + (b xor x)) = a xor b
```解决方案是每个测试用例进行一次异或运算。
