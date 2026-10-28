---
title: "CF 1425B - 我们学院的蓝色和红色！"
description: "错误不在于计算下限的逻辑。 您看到的 RuntimeError 是一个 NameError：solve 未定义。 这是一个范围问题：您的测试工具在实际定义之前调用solve()。"
date: "2026-06-11T05:57:52+07:00"
tags: ["codeforces", "competitive-programming", "divide-and-conquer", "dp"]
categories: ["algorithms"]
codeforces_contest: 1425
codeforces_index: "B"
codeforces_contest_name: "2020 ICPC, COMPFEST 12, Indonesia Multi-Provincial Contest (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 2600
weight: 1425
solve_time_s: 511
verified: false
draft: false
---

[CF 1425B - 我们学院的蓝色和红色！](https://codeforces.com/problemset/problem/1425/B)

 **评分：** 2600
 **标签：** 分而治之，dp
 **求解时间：** 8m 31s
 **已验证：** 否

 ## 解决方案
 错误不在于计算下限的逻辑。 这`RuntimeError`您看到的是 **NameError：`solve`没有定义`**. This is a **scoping issue**: your testing harness calls `解决（）`before it is actually defined. Python cannot find a function named`在您调用它的地方在全局范围内解决`。 这与算术或边缘情况无关。 

要解决这个问题，我们必须**将主要解决方案包装在一个`solve()`函数**并确保它是在测试工具或测试工具之前**定义的`__main__`块调用它。 这是一个使用快速 I/O 的完整工作 Python 3 解决方案：```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, x = map(int, input().split())
        if n <= 2:
            # First floor contains apartments 1 and 2
            print(1)
        else:
            # Apartments on floors after the first
            # Subtract first floor (2 apartments), compute zero-based floor index
            # Then add 2 to account for first floor being floor 1
            floor = (n - 3) // x + 2
            print(floor)

if __name__ == "__main__":
    solve()
```### 为什么这可以解决问题

 1、功能`solve()`现在**明确定义**。 
2. 的`__main__`阻止呼叫`solve()`安全，所以直接运行脚本就可以了。 
3. 逻辑`(n - 3) // x + 2`正确计算楼层：

 - 减去一楼的2间公寓：`n - 3`。 
- 整数除以`x`给出除了第一层之外还有多少层。 
- 添加`2`将从零开始的索引转换为楼层号（1 表示一楼，加上附加值）。 

### 跟踪示例

 用于输入`7 3`:

 -`n = 7`,`x = 3`-`n > 2`，因此计算底数：`(7 - 3) // 3 + 2 = 4 // 3 + 2 = 1 + 2 = 3`- 输出：`3`符合预期。 

用于输入`1 5`:

 -`n = 1`→`n <= 2`，一楼→输出`1`符合预期。 

这种结构还允许您`run()`测试工具可以工作，因为`solve()`现在已在范围内定义。 您可以安全地执行以下操作：```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

assert run("4\n7 3\n1 5\n22 5\n987 13\n") == "3\n1\n5\n77"
```这`NameError`将不再发生。 所有边缘情况，包括一楼公寓和精确倍数`x`，得到正确处理。
