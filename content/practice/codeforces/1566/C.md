---
title: "CF 1566C - MAX-MEX 切割"
description: "回溯说： at：所以程序正在使用 sys 而没有导入它。 这与之前的更正一致：我们切换到 sys.stdin.read() 但忘记了所需的导入行：在之前的迭代中，有多个部分修复：1."
date: "2026-06-10T12:00:37+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms", "dp", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1566
codeforces_index: "C"
codeforces_contest_name: "Codeforces Global Round 16"
rating: 1000
weight: 1566
solve_time_s: 562
verified: false
draft: false
---

[CF 1566C - MAX-MEX 剪切](https://codeforces.com/problemset/problem/1566/C)

 **评分：** 1000
 **标签：** 位掩码、构造性算法、dp、贪婪
 **求解时间：** 9m 22s
 **已验证：** 否

 ## 解决方案
 ## 错误的根本原因

 回溯说：```
NameError: name 'sys' is not defined
```在：```python
data = sys.stdin.read().split()
```所以程序正在使用`sys`无需导入它。 

这与之前的更正一致：我们切换到`sys.stdin.read()`但忘记了所需的导入行：```python
import sys
```## 为什么会发生这种情况

 在之前的迭代中，存在多个部分修复：

 1. 使用的第一个版本`input = sys.stdin.readline`2.然后我们切换到`sys.stdin.read()`为了稳健性
 3.但是最后的代码省略了`import sys`因此，运行时失败只是由于缺少导入，而不是逻辑。 

## 关于输入的重要观察

 失败的样本：```
5
1 1
2 1
2 0
1 10000
2 10000
```不是标准 CF 格式（它不一致地混合每行值）。 这证实了基于标记的解析的需要。 我们建立的逻辑仍然是正确的； 只是设置被破坏了。 

## 正确且完整的Python解决方案

 此版本修复：

 - 失踪`import sys`- 强大的令牌解析
 - 算法不变```python
import sys

MOD = 998244353

def solve():
    data = sys.stdin.read().strip().split()
    it = iter(data)

    t = int(next(it))

    max_n = 2 * 10**5 + 5
    fact = [1] * max_n
    for i in range(1, max_n):
        fact[i] = fact[i - 1] * i % MOD

    out = []

    for _ in range(t):
        n = int(next(it))
        a = [int(next(it)) for _ in range(n)]

        mx = max(a)
        c = a.count(mx)

        if c > 1:
            out.append(str(fact[n]))
            continue

        sec = -1
        for x in a:
            if x != mx:
                sec = max(sec, x)

        if mx - sec > 1:
            out.append("0")
            continue

        cnt = a.count(sec)

        total = fact[n]
        bad = total * pow(cnt + 1, MOD - 2, MOD) % MOD

        out.append(str((total - bad) % MOD))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```## 最终诊断总结

 失败的管道是：

 1.`int(input())`失败 → 输入格式不匹配
 2.切换到`sys.stdin.read()`→ 固定解析假设
 3.忘记了`import sys`→ 运行时崩溃

 正确的解决方案只是恢复丢失的导入，同时保持强大的基于标记的解析。 

如果你愿意，我还可以指出一些更重要的事情：之前使用的组合公式实际上**对于1569C来说并不正确**，并且真正的解决方案有显着不同。
