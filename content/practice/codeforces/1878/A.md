---
title: "CF 1878A - 代托纳要多少钱？"
description: "该问题询问，给定一个整数数组和一个目标整数 $k$，是否存在至少一个连续子数组，其中 $k$ 是比任何其他元素出现更频繁的元素。"
date: "2026-06-08T22:50:36+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1878
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 900 (Div. 3)"
rating: 800
weight: 1878
solve_time_s: 106
verified: true
draft: false
---

[CF 1878A - 代托纳要多少钱？](https://codeforces.com/problemset/problem/1878/A)

 **评分：** 800
 **标签：** 贪婪
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 问题是，给定一个整数数组和一个目标整数$k$，至少存在一个连续的子数组，其中$k$是比任何其他元素出现更频繁的元素。 每个测试用例给出数组的大小$n$, 目标$k$，和数组$a$本身。 如果存在这样的子段，则每个测试用例的答案为“是”，否则为“否”。 

限制很小：$n$最多为 100，并且$t$，测试用例数量最多为1000个。每个元素$a_i$和$k$也最多为 100。这意味着$O(n^2)$单个测试用例的方法将探索所有子数组，在计算方面是可以接受的，因为最坏的情况将涉及$1000 \cdot 100^2 = 10^7$操作，可在 1 秒的时间限制内进行管理。 

微妙的边缘情况出现时$k$在数组中仅出现一次或出现在最后或开头。 例如，如果$a = [1, 2, 3]$和$k = 3$，唯一包含的子数组$k$是$[3]$。 在这种情况下，算法必须正确识别单元素子数组是否合格，如$k$显然是最常见的元素。 另一种需要考虑的情况是$k$出现多次但总是被其他元素分隔，这样就没有子数组允许$k$在计数中占主导地位； 正确处理最小长度窗口可确保解决方案的稳健性。 

## 方法

 蛮力解决方案将迭代所有可能的子数组$a$并计算该子数组中每个元素的频率，然后检查是否$k$计数最高。 对于单个长度的数组$n$, 大致有$n(n+1)/2$子阵列，并且计算每个子阵列中的频率可能需要$O(n)$操作，导致$O(n^3)$每个测试用例。 这种方法是正确的，但即使对于$n = 100$，产生$10^6$每个测试用例的操作和$10^9$在所有测试用例中最坏的情况下。 

一个关键的观察大大减少了这个问题：$k$只需要在子数组中最多出现一次$k$在附近统治其邻国。 更具体地说，如果$k$至少出现两次并且两次出现的位置$i$和$j$和$j - i \le 2$， 然后$k$可以是子数组中最常见的覆盖位置$i$通过$j$。 如果数组的长度为一或者周围没有其他元素与其竞争，则出现一次就足够了。 

最佳解决方案通过扫描阵列并检查出现之间的距离来利用这一点$k$。 如果$k$在两个元素的距离内至少出现两次，我们可以立即回答“是”。 否则，我们检查是否$k$数组中至少出现一次：如果只出现一次且数组长度为1，则答案为“YES”； 如果阵列较长，则单个隔离$k$就足够了，因为即使在两个元素的子数组中，如果另一个元素不同，它也可能是最常见的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n3) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 对于每个测试用例，请阅读$n$,$k$，和数组$a$。 
2.数数有多少次$k$出现在数组中。 如果出现零次，则打印“NO”并移至下一个测试用例。 
3. 如果数组只包含一个元素，则打印“YES”（如果该元素是）$k$。 
4. 否则，迭代数组并检查每对索引$i$和$j$在哪里$i < j$和$j - i \le 2$。 如果两个位置都包含$k$，立即打印“YES”。 
5. 如果没有找到这样的对，但是$k$数组中存在，则打印“YES”，因为单元素子数组包含$k$符合资格。 
6. 如果这些条件都不满足，则打印“NO”。 

为什么它有效：这里的不变性是任何长度为 1 的子数组包含$k$自动有效。 对于较长的子阵列，距离检查可确保$k$可以支配至少两个相邻元素，形成一个有效的子数组。 该算法正确识别所有最小子数组，其中$k$可能是最频繁的，避免对所有子数组进行不必要的计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    
    count_k = a.count(k)
    
    if count_k == 0:
        print("NO")
        continue
    
    if n == 1:
        print("YES")
        continue
    
    found = False
    for i in range(n):
        if a[i] != k:
            continue
        for j in range(i, min(i + 3, n)):
            if a[j] == k and j - i <= 2:
                found = True
                break
        if found:
            break
    
    print("YES" if found else "NO")
```该解决方案首先计算出现次数$k$。 如果$k$不存在，答案是“否”。 单元素数组处理起来很简单。 嵌套循环检查小窗口（长度最多 3）内的对，以查看是否$k$可以在当地占据主导地位。 内循环的上限确保我们不会超出数组范围。 

## 工作示例

 **示例输入 1：**```
5 4
1 4 3 4 1
```| 我| j | 一个[i..j] | 状况检查 | 结果 |
 | ---| ---| ---| ---| ---|
 | 1 | 2 | [4,3]| k 出现一次，长度为 2，占主导地位 | 是 |

 这显示了一个有效的子数组 [4,3]，其中 4 是最常见的。 

**示例输入 2：**```
4 1
2 3 4 4
```| 我| j | 一个[i..j] | 状况检查 | 结果 |
 | ---| ---| ---| ---| ---|
 | 0 | 0 | [2] | k=1 不存在 | 否 |
 | ... | ... | ... | 没有一个包含 k | 否 |

 没有子数组包含 1，因此算法正确输出“NO”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t * n) | 每个测试用例扫描数组一次并检查最多 3 个元素的小窗口。 |
 | 空间| O(n) | 存储每个测试用例的数组。 |

 给定$t \le 1000$和$n \le 100$, 至多$10^5$操作的发生完全在 1 秒限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        a = list(map(int, input().split()))
        count_k = a.count(k)
        if count_k == 0:
            print("NO")
            continue
        if n == 1:
            print("YES")
            continue
        found = False
        for i in range(n):
            if a[i] != k:
                continue
            for j in range(i, min(i + 3, n)):
                if a[j] == k and j - i <= 2:
                    found = True
                    break
            if found:
                break
        print("YES" if found else "NO")
    return output.getvalue().strip()

# provided samples
assert run("7\n5 4\n1 4 3 4 1\n4 1\n2 3 4 4\n5 6\n43 5 60 4 2\n2 5\n1 5\n4 1\n5 3 3 1\n1 3\n3\n5 3\n3 4 1 5 5\n") == \
"YES\nNO\nNO\nYES\nYES\nYES\nYES", "Sample tests"

# custom cases
assert run("2\n1 1\n1\n3 2\n1 2 2\n") == "YES\nYES", "single-element and duplicate k"
assert run("1\n5 5\n1 2 3 4 5\n") == "YES", "k at end"
assert run("1\n4 10\n1 2 3 4\n") == "NO", "k absent"
assert run("1\n3 2\n2 1 2\n") == "
```
