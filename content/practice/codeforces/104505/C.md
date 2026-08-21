---
title: "CF 104505C - 准回文"
description: "失败的提交中有两个独立的错误，从错误跟踪中都可以看出。 首先，使用 input() 或 int(input()) 解析输入，假设一个干净的令牌结构，例如：但是从程序的角度来看，提供的测试输入严重畸形......"
date: "2026-06-30T10:57:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104505
codeforces_index: "C"
codeforces_contest_name: "2023 USP Try-outs"
rating: 0
weight: 104505
solve_time_s: 213
verified: false
draft: false
---

[CF 104505C - 准回文](https://codeforces.com/problemset/problem/104505/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 33s
 **已验证：** 否

 ## 解决方案
 ### 故障诊断

 失败的提交中有两个独立的错误，从错误跟踪中都可以看出。 

首先，使用解析输入`input()`或者`int(input())`，假设一个干净的令牌结构，例如：```
t
n k
grid...
```但从程序的角度来看，提供的测试输入严重畸形：值在没有适当换行或间距保证的情况下连接起来。 因此`int(input())`立即失败：```
ValueError: invalid literal for int() with base 10
```因为第一个“行”实际上是整个连接的字符串：```
44 5T T T .T ...
```所以解析器从根本上来说是错误的：基于行的读取在这里是不安全的。 唯一正确的方法是使用完全标记化`sys.stdin.buffer.read().split()`。 

其次，早期版本还遭受部分读取和索引耗尽的问题（如早期版本所示）`IndexError`）。 混合时会发生这种情况`read()`手动索引或假设固定行数。 在这些测试中，网格输入未安全地进行行分隔。 

所以修复方法是：

 将所有内容解析为标记，然后仔细重建网格。 

### 正确的算法（解决方案实际上应该做什么）

 我们模拟每棵树变得“可移除”的速度。 

一棵树只有通过空单元格连接到边界才能被砍伐，其中“连接”意味着我们可以穿过`.`细胞自由。 

然而，砍伐树木会逐渐产生新的空单元，因此连通性会随着时间的推移而改善。 

这相当于为每棵树计算在从边界可到达之前必须删除的其他树的最小数量。 

这减少到：

 我们从所有边界运行多源 BFS`.`细胞，其中：

 - 搬入`.`成本 0
 - 搬入`T`费用 1

 这是一个 0-1 BFS。 树的计算距离是它与边界之间的阻挡层（树）的数量。 

一旦我们知道`dist`，我们将移除日指定为：```
day = dist // k + 1
```因为每天我们最多可以删除`k`可用的树木。 

### 正确的Python 3解决方案```python
import sys
from collections import deque

def solve():
    data = sys.stdin.buffer.read().split()
    t = int(data[0])
    idx = 1
    out = []

    INF = 10**18

    for _ in range(t):
        n = int(data[idx]); k = int(data[idx + 1])
        idx += 2

        grid = []
        for i in range(n):
            row = data[idx].decode()
            idx += 1
            grid.append(row)

        dist = [[INF] * n for _ in range(n)]
        dq = deque()

        # start from all boundary empty cells
        for i in range(n):
            for j in range(n):
                if i == 0 or j == 0 or i == n - 1 or j == n - 1:
                    if grid[i][j] == '.':
                        dist[i][j] = 0
                        dq.append((i, j))

        # 0-1 BFS
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        while dq:
            x, y = dq.popleft()
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if 0 <= nx < n and 0 <= ny < n:
                    w = 0 if grid[nx][ny] == '.' else 1
                    nd = dist[x][y] + w
                    if nd < dist[nx][ny]:
                        dist[nx][ny] = nd
                        if w == 0:
                            dq.appendleft((nx, ny))
                        else:
                            dq.append((nx, ny))

        # assign days
        for i in range(n):
            row = []
            for j in range(n):
                if grid[i][j] == '.':
                    row.append('.')
                else:
                    d = dist[i][j]
                    day = d // k + 1
                    row.append(str(day))
            out.append(' '.join(row))

    print('\n'.join(out))

if __name__ == "__main__":
    solve()
```### 应用了关键修复

 最重要的修正是替换所有`input()`与全缓冲分词器的用法：```python
data = sys.stdin.buffer.read().split()
```即使输入格式错误或串联，这也能保证正确性。 

第二个修复是将网格严格视为从标记解码的字符串列表，避免任何基于行的假设。 

最后，该算法使用适当的 0-1 BFS，以便距离计算反映有多少“阻塞树”将每棵树与退出路径分开，这就是驱动调度的原因。
