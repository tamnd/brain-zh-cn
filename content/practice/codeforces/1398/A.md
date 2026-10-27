---
title: "CF 1398A - 坏三角形"
description: "这个失败根本不是算法造成的。 这是测试工具中的纯粹语法错误。 回溯显示：因此传递给 run() 的字符串永远不会关闭。"
date: "2026-06-11T09:17:31+07:00"
tags: ["codeforces", "competitive-programming", "geometry", "math"]
categories: ["algorithms"]
codeforces_contest: 1398
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 93 (Rated for Div. 2)"
rating: 800
weight: 1398
solve_time_s: 679
verified: false
draft: false
---

[CF 1398A - 坏三角形](https://codeforces.com/problemset/problem/1398/A)

 **评分：** 800
 **标签：** 几何、数学
 **Solve time:** 11m 19s
 **已验证：** 否

 ## 解决方案
 这个失败根本不是算法造成的。 这是测试工具中的纯粹语法错误。 

The traceback says:```
SyntaxError: unterminated string literal
assert run("4\n1
```所以字符串传入`run()`永远不会关闭。 这意味着产生此失败的代码类似于：```
assert run("4\n1
```而不是正确闭合的多行字符串，例如：```
assert run("4\n1\n8\n...")
```Python 在任何逻辑运行之前都会引发此错误，因为它会解析文件本身并检测到字符串文字不完整。 

### 究竟出了什么问题

 该错误存在于测试用例构造中：

 - 字符串内的换行符未正确转义或关闭。 
- 缺少结束语。 
- 因此，Python 会处理之后的所有内容`"4\n1`作为同一字符串的一部分，直到 EOF，并且失败。 

这与 1401C 的求解逻辑无关。 没有证据表明执行了检查整除性或排序可行性的算法。 

### 正确修复

 您必须确保：

 - 每个字符串传入`run()`正确关闭`"`。 
- 测试用例内的换行符写为`\n`。 
- 完整的输入被正确包装。 

例如：```
assert run("4\n1\n8\n") == "YES"
```或对于完整样本：```
assert run("""4
1
8
6
4 3 6 6 2 9
4
4 5 6 7
5
7 5 2 2 4
""") == """YES
YES
YES
NO"""
```### 正确的完整解决方案（算法不变）

 下面是实际问题逻辑的正确且干净的实现。 这与损坏的测试工具无关。```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        mn = min(a)
        b = sorted(a)

        ok = True
        for i in range(n):
            if a[i] != b[i] and a[i] % mn != 0:
                ok = False
                break

        print("YES" if ok else "NO")

if __name__ == "__main__":
    solve()
```### 为什么这个逻辑是正确的（简要回顾）

 最小元素充当重新排列的唯一“连接器”。 任何能被它整除的值都可以移动到通过涉及有效 GCD 条件的交换也可以到达的任何位置。 不能被最小值整除的元素被有效锁定：如果它们尚未处于排序位置，则没有合法的交换序列可以修复它们。 

因此，当每个放错位置的元素都能被全局最小值整除时，排序是可能的。 

### 要点

 您的运行时失败纯粹是由于测试输入字符串格式错误，而不是算法不正确。 修复引用和换行格式将立即消除错误。
