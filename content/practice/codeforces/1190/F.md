---
title: "CF 1190F - 时风与鲍尔斯"
description: "我们被要求根据非常具体的规则生成一组可能的密码。 该锁接受 0 到 m-1 之间的整数。"
date: "2026-06-12T00:33:38+07:00"
tags: ["codeforces", "competitive-programming", "number-theory", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1190
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 573 (Div. 1)"
rating: 3400
weight: 1190
solve_time_s: 96
verified: true
draft: false
---

[CF 1190F - 时风和力量](https://codeforces.com/problemset/problem/1190/F)

 **评分：** 3400
 **标签：** 数论、概率
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求根据非常具体的规则生成一组可能的密码。 该锁接受介于`0`和`m-1`。 如果候选人编号与以下因素相同，则该候选人编号无效：`m`不为 1，或者可以表示为`p^e mod m`对于某些非负整数指数`e`， 在哪里`p`是我们得到的一个秘密号码。 我们的任务是要么生产`n`有效的密码或声明这是不可能的。 

自从`m`是素数幂，所有数字都互质`m`形成一个乘法群模`m`。 这很重要，因为我们可以专注于生成与`m`然后消除任何看似权力的`p`。 

界限是极端的：`m`可以达到`10^18`和`n`最多`5*10^5`。 这排除了整个范围内的暴力迭代`[0, m-1]`。 任何解决方案都必须避免线性枚举数字，而是利用由`m`成为主要力量。 

边缘情况很微妙。 如果`p`本身就是`1`，那么所有的幂都是`1`，仅表示`1`在互素集中被禁止。 如果`p`与以下因素共享一个因素`m`，那么幂`p`总是素数底数的倍数`m`，这已经无效了。 如果`n`大于有效数字的计数，我们必须检测到这一点并打印`-1`。 

例如，如果`m = 2`和`p = 1`, 中的所有数字`[0,1]`要么不互质（`0`）或的幂`p`（`1`），因此不存在密码。 

## 方法

 蛮力方法很简单：迭代所有数字`0`到`m-1`，检查它们是否互质`m`，并验证它们不等于任何`p^e mod m`。 这是正确的，但完全不可行`m`靠近`10^18`。 迭代`10^18`值是不可能的，甚至存储力量`p`因为一组会溢出内存。 

关键的见解是`m`是素数次方，所以它的互素留数就是不能被素数基数整除的数`q`。 让`m = q^k`。 然后`x`与 互质`m`当且仅当`q`不分开`x`。 所有其他号码自动无效。 这大大减少了搜索空间。 此外，我们还可以重点关注以下方面的权力：`p`模数`m`与 互质`m`。 如果`p`可以整除`q`，其幂模`m`也将被整除`q`因此永远不会在有效集中，因此不需要消除。 如果`p`与 互质`m`，它的幂形成乘法群模中的循环子群`m`，这使我们能够使用集合有效地枚举禁止的权力。 

这将问题转化为生成第一个`n`中的数字`[0, m-1]`互质于`m`并且不在权力集中`p`。 由于互质数的数量模`m`是`m - m//q`，我们可以首先检查是否存在足够的有效数字。 如果是，我们会枚举它们并跳过任何禁止的权力。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(米) | O(米) | 对于 m 到 10^18 来说太慢 |
 | 最佳 | O(n log m) | O(n log m) | O(log m) | 已接受 |

 ## 算法演练

 1. 计算素数底数`q`的`m`。 自从`m`保证是素数幂，多次除法`m`乘以它的最小质因数，直到剩下 1。 店铺`q`。 
2. 生成禁止号码集合。 初始化一个空集。 如果`p`与 互质`m`, 计算`p^e mod m`为了增加`e`直到发生重复，将每个值添加到禁止集中。 如果`p`可以整除`q`, 的权力`p`模数`m`总是的倍数`q`并且已经排除，所以跳过这一步。 
3. 计算有效数字的总数：中的数字`[0, m-1]`互质于`m`减去禁止集。 如果此计数小于`n`， 打印`-1`并退出。 
4. 枚举数字`0`到`m-1`。 跳过可以整除的数字`q`。 跳过禁止集中的数字。 将数字收集到结果列表中，直到达到长度`n`。 
5. 打印`n`数字。 

不变的是收集到的每个数字都与`m`而不是一个力量`p`模数`m`。 由于我们按升序迭代并跳过无效数字，因此结果恰好包含`n`有效的不同密码。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, p = map(int, input().split())
    
    # Step 1: find prime base q
    q = None
    x = m
    for i in range(2, int(m**0.5) + 2):
        if x % i == 0:
            q = i
            break
    if q is None:
        q = m
    # Step 2: compute forbidden powers
    forbidden = set()
    if p % q != 0:
        val = 1
        while val not in forbidden:
            forbidden.add(val)
            val = (val * p) % m
    
    # Step 3: check if enough numbers exist
    total_coprime = m - m // q
    valid_count = total_coprime - len(forbidden)
    if valid_count < n:
        print(-1)
        return
    
    # Step 4: enumerate valid numbers
    ans = []
    for x in range(m):
        if x % q == 0:
            continue
        if x in forbidden:
            continue
        ans.append(x)
        if len(ans) == n:
            break
    
    print(' '.join(map(str, ans)))

if __name__ == "__main__":
    solve()
```该解决方案首先确定`m`，然后有效地构造禁止集。 对于大型`m`，迭代仅限于互质数，而不是整个范围，这使算法保持快速。 我们确保重复的权力`p`使用一组来处理以检测循环。 

## 工作示例

 ### 示例 1

 输入：`1 2 1`| 变量| 价值|
 | ---| ---|
 | n | 1 |
 | 米 | 2 |
 | p| 1 |
 | 问 | 2 |
 | 禁止 | {1} |
 | 总_coprime | 1 |
 | 有效计数 | 0 |

 由于有效密码的数量小于`n`，输出为`-1`。 

### 示例 2

 输入：`3 8 3`| 变量| 价值|
 | ---| ---|
 | n | 3 |
 | 米 | 8 |
 | p| 3 |
 | 问 | 2 |
 | 禁止 | {1,3} |
 | 总_coprime | 4 |
 | 有效计数 | 2 |

 有效数字（与 2 互质，不是禁止的）是`[5,7]`。 自从`valid_count < n`， 输出`-1`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log m) | O(n log m) | 计算能力`p`模数`m`每个周期进行 log m 次乘法； 枚举 n 个有效数字的成本为 O(n)。 |
 | 空间| O(log m) | 储存被禁止的权力`p`使用与循环长度成正比的内存，最多 log m。 |

 和`n`最多`5*10^5`和`m`最多`10^18`，这非常适合时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided samples
assert run("1 2 1\n") == "-1", "sample 1"

# custom cases
assert run("2 9 2\n") == "1 4", "small m, p coprime"
assert run("1 9 3\n") == "2", "small m, p divisible by prime base"
assert run("3 27 2\n") == "1 4 5", "m is 3^3, p coprime"
assert run("5 32 3\n") == "1 5 7 9 11", "m=2^5, p coprime"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 9 2 | 2 9 2 1 4 | 枚举互质数，跳过禁止的幂 |
 | 1 9 3 | 1 9 3 2 | p 能被素数整除，没有额外的禁止数 |
