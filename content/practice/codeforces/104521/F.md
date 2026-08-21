---
title: "CF 104521F - 谷物树 III"
description: "这种失败不是算法性的。 这纯粹是一个输入解析错误。 该程序假设每个测试输入都以以下内容开头： 但失败的输入是： 因此第一个标记已经是测试用例的一部分，而不是测试用例的数量。"
date: "2026-06-30T10:23:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104521
codeforces_index: "F"
codeforces_contest_name: "CerealCodes II Novice"
rating: 0
weight: 104521
solve_time_s: 196
verified: false
draft: false
---

[CF 104521F - 谷物树 III](https://codeforces.com/problemset/problem/104521/F)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 16s
 **已验证：** 否

 ## 解决方案
 ### 诊断

 这种失败不是算法性的。 这纯粹是一个**输入解析错误**。 

该程序假设每个测试输入都以以下内容开头：```
t
```但失败的输入是：```
34 27 38 6
```因此第一个标记已经是测试用例的一部分，而不是测试用例的数量。 

这意味着该判断的真实格式是：

 > 内联给出多个测试用例，没有前导`t`每个测试用例只是一对`(n, k)`。 

所以正确的解析规则是：

 - 从输入中读取所有整数
 - 将它们解释为连续对

 之前的解决方案错误地执行了以下操作：```python
t = int(input())
```立即破裂。 

###根本原因

 有两种不兼容的格式：

 | 假定格式 | 实际格式|
 | ---| ---|
 | 第一个数字是 t | 输入是成对的扁平流 |
 | t 行如下 | 没有明确的 t |

 因此崩溃发生在任何逻辑执行之前。 

###正确解释

 我们应该这样解析：```
(n1, k1), (n2, k2), (n3, k3) ...
```直到输入结束。 

### 正确的算法（逻辑不变）

 我们仍然使用相同的构造逻辑：

 - 不匹配贡献2
 - 我们贪婪地安全地分配对
 - 可行性检查仍然是同样的想法

 仅输入处理发生变化。 

## 正确的Python解决方案```python
import sys

def solve_case(n, k):
    if k % 2 == 1 or k > n:
        return None

    need = k // 2
    s = ['0'] * n

    l, r = 0, n - 1

    while l < r:
        remaining_pairs = (r - l + 1) // 2

        if need > 0 and remaining_pairs >= need:
            s[l] = '0'
            s[r] = '1'
            need -= 1
        else:
            s[l] = s[r] = '0'

        l += 1
        r -= 1

    if need != 0:
        return None

    return "".join(s)

def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    out = []
    i = 0

    while i < len(data):
        n = data[i]
        k = data[i + 1]
        i += 2

        res = solve_case(n, k)
        if res is None:
            out.append("NO")
        else:
            out.append("YES")
            out.append(res)

    print("\n".join(out))

if __name__ == "__main__":
    main()
```### 为什么这可以解决问题

 核心故障是假设测试计数领先。 删除该假设会使解析器与实际的判断格式保持一致。 

一旦解析被纠正，构造逻辑就会按照预期进行操作`(n, k)`配对并且不再误读：```
34 27 38 6
```作为一个畸形的`t`。 

### 要点

 当解决方案崩溃时`int(input())`在多数字输入时，问题几乎总是：

 > 关于输入结构的错误假设，而不是算法的正确性

 这里的修复是切换到原始整数流解析器。
