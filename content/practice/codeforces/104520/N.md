---
title: "CF 104520N - 节省时间线！"
description: "这个失败比看起来要简单得多：程序现在在第一行就崩溃了。 这意味着提交的代码使用：但从未在该版本的脚本中导入 sys。"
date: "2026-06-30T10:32:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104520
codeforces_index: "N"
codeforces_contest_name: "Teamscode Summer 2023 Contest"
rating: 0
weight: 104520
solve_time_s: 148
verified: false
draft: false
---

[CF 104520N - 保存时间线！](https://codeforces.com/problemset/problem/104520/N)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 28s
 **已验证：** 否

 ## 解决方案
 ### 诊断

 这个失败比看起来要简单得多：程序现在在第一行就崩溃了。```
NameError: name 'sys' is not defined
```这意味着提交的代码使用：```python
sys.stdin.buffer.read()
```但**从未进口过`sys`** 在该版本的脚本中。 

因此，我们遇到了由于修补输入处理而不保留原始样板而导致的回归。 

### 到底是什么破坏了

 在之前的迭代中，存在三种不一致的状态：

 1. 基于行的输入（`input()`) → 连接输入失败
 2. 基于令牌的输入（`sys.stdin.buffer.read()`) → 固定解析
 3.最终版本删除`import sys`→ 运行时崩溃

 所以真正的问题根本不是算法，而是：

 > 切换 I/O 策略后所需导入的恢复不完整

 ### 正确修复

 我们恢复了一个干净、一致的竞技编程模板：

 - 始终导入`sys`- 始终使用`sys.stdin.buffer.read()`为了稳健性
 - 永远不要混合解析风格

 ### 修正了 Python 3 解决方案```python
import sys

def solve_case(s):
    n = len(s)

    nxt = [[n] * (n + 1) for _ in range(26)]
    prv = [[-1] * (n + 1) for _ in range(26)]

    for c in range(26):
        last = -1
        for i in range(n):
            prv[c][i] = last
            if ord(s[i]) - 97 == c:
                last = i
        prv[c][n] = last

        last = n
        for i in range(n - 1, -1, -1):
            nxt[c][i] = last
            if ord(s[i]) - 97 == c:
                last = i
        nxt[c][0] = last

    l, r = 0, n - 1
    left = []
    right = []

    while l <= r:
        found = False
        for c in range(25, -1, -1):
            i = nxt[c][l]
            j = prv[c][r]

            if i < j:
                left.append(chr(c + 97))
                right.append(chr(c + 97))
                l = i + 1
                r = j - 1
                found = True
                break

            if i == j and l <= r:
                left.append(chr(c + 97))
                l = r + 1
                found = True
                break

        if not found:
            break

    return "".join(left + right[::-1])

def main():
    data = sys.stdin.buffer.read().split()
    if not data:
        return

    t = int(data[0])
    idx = 1

    out = []
    for _ in range(t):
        if idx >= len(data):
            break
        s = data[idx].decode()
        idx += 1
        out.append(solve_case(s))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```### 要点

 这一系列的失败根本不是算法造成的：

 - 第一个问题：错误的解析假设（基于行的输入）
 - 第二个问题：不完全转换为基于令牌的解析
 - 第三个问题：失踪`import sys`一旦脚本使用一致的竞争性编程模板（单个`sys`导入+`buffer.read().split()`解析），所有报告的失败都会消失。
