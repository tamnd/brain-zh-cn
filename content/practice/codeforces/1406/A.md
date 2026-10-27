---
title: "CF 1406A - 墨西哥子集"
description: "给定一个整数多重集，我们可以将其元素重新分配为两组，称为 A 和 B，而无需更改每个值总体存在的副本数量。 每个元素必须准确地进入两个组之一，但重复项可以任意拆分。"
date: "2026-06-11T07:53:45+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1406
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 670 (Div. 2)"
rating: 900
weight: 1406
solve_time_s: 84
verified: true
draft: false
---

[CF 1406A - Subset Mex](https://codeforces.com/problemset/problem/1406/A)

 **评分：** 900
 **标签：** 贪婪、实现、数学
 **求解时间：** 1m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个整数多重集，我们可以将其元素重新分配为两组，称为 A 和 B，而无需更改每个值总体存在的副本数量。 每个元素必须准确地进入两个组之一，但重复项可以任意拆分。 

For any group, we compute the mex, which is the smallest non-negative integer that does not appear in that group. The task is to assign elements into A and B so that the sum mex(A) + mex(B) is as large as possible.

 关键结构是 mex 仅取决于我们是否设法“覆盖”从 0 开始的序列。如果集合中缺少某个数字，则超出该数字的所有内容都与其 mex 无关。 

The constraints are small: at most 100 test cases, and each array has size at most 100. This immediately rules out anything beyond linear or quadratic reasoning per test case. Even O(n³) would likely pass, but we do not need anything close to that. 该问题旨在解决贪婪计数论证。 

A subtle edge case appears when some small numbers are missing entirely. If 0 is missing, both sets immediately have mex 0 regardless of anything else. 另一种情况是当一个数字只出现一次时：它最多只能有助于两个集合中的一个扩展其连续前缀的能力，这直接限制了两个 mex 值可以同时变得多大。 

## 方法

 A brute-force solution would try every way of assigning each element to either A or B. There are 2^n such assignments, and for each one computing two mex values costs O(n). This becomes O(n·2^n), which is far too large even for n = 100.

The important observation is that mex(A) = k means that A must contain every number from 0 to k−1 at least once. The same applies to B. So the problem becomes about how many complete prefixes starting from 0 we can simultaneously “supply” to two groups using limited copies of each number.

 我们不需要考虑完整的分配，而只需要知道每个值为构建这些前缀提供了多少可用副本。 Each number x can contribute at most twice overall toward the two mex computations, but only if it appears at least twice. 如果出现一次，也只能帮助一方面。 如果它出现零次，它会立即破坏两个前缀。 

This reduces the problem to scanning values from 0 upward and tracking whether we can continue building the first and second mex simultaneously. 每次我们遇到频率至少为 2 的值时，A 和 B 都可以包含它。 如果频率恰好为 1，则只有其中一个可以扩展，因此一个“链”会继续，而另一个“链”可能会被迫停止，除非我们仔细管理分配。 This greedy tracking leads to a direct counting of how far both mex values can be extended.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n·2^n) | O(n·2^n) | O(n) | 太慢了 |
 | 频率贪婪扫描| O(maxA_i) | O(1) | O(1) | 已接受 |

 ## 算法演练

 We compress the input into a frequency array where cnt[x] stores how many times x appears.

 然后我们模拟并行构建两个 mex 序列。

1. 我们维护两个标志，指示A和B是否仍然可以继续从0开始构建连续的前缀。最初两者都是活动的。 
2. 我们从 0 向上迭代 x。 
3. 如果 cnt[x] == 0，则两个序列都被迫在 x 处停止，因为两个集合都不能包含 x，因此两个 mex 值最多为 x。 
4. 如果cnt[x] == 1，则两组中恰好有一组可以接收x。 这意味着只有一个前缀可以继续经过 x，而另一个前缀必须在 x 处停止。 我们贪婪地分配这个单一事件来扩展较小的或当前不太“饱和”的一侧，但由于我们只关心长度，因此它在两个 mex 计算中贡献了一个扩展总数。 
5. 如果 cnt[x] >= 2，则两个集合都可以包含 x，因此两个前缀都可以安全地继续。 
6. 我们累积贡献：每当一个集合成功包含 x 时，它就会增加其潜在的 mex 边界。 
7. 一旦两个序列不能再被扩展，该过程就会停止。 

最终答案是 A 和 B 取得进展的总和。 

它之所以有效的根源在于，mex 完全由从 0 开始的最长连续前缀决定。每个值 x 仅在所有较小值都已受支持的情况下才相关。 在每一步中，唯一的限制因素是我们是否有足够的 x 副本来提供两个前缀。 如果我们这样做，两者都会继续； 如果我们有一个，则只有一个继续； 如果我们都没有，那就都结束了。 后面的值无法修复之前缺失的值，因此该过程是不可逆的，贪婪的决策是安全的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        
        cnt = [0] * 105
        for x in a:
            cnt[x] += 1
        
        ans = 0
        
        for x in range(0, 105):
            if cnt[x] == 0:
                break
            elif cnt[x] == 1:
                ans += 1
            else:
                ans += 2
        
        print(ans)

if __name__ == "__main__":
    solve()
```该实现将多重集压缩到频率表中，然后按升序扫描值。 答案是直接累加的：具有两个或多个副本的值贡献两个“用途”，这意味着两个集合都可以将其包含在其前缀链中； 具有一份副本的值仅贡献一份； 缺失值会立即终止两条链，因为这两个链都无法实现超出该点的 mex。 

关键的实现细节是 cnt[x] == 0 上的早期中断。如果没有它，我们会错误地假设后面的值可以补偿丢失的前缀元素，而根据 mex 的定义这是不可能的。 

## 工作示例

 ### 示例 1

 输入：```
6
0 2 1 5 0 1
```我们计算频率：

 | x| 碳纳米管[x] | 贡献 |
 | ---| ---| ---|
 | 0 | 2 | 2 |
 | 1 | 2 | 2 |
 | 2 | 1 | 1 |
 | 3 | 0 | 停止|

 我们累加直到 x = 2：

 总计 = 2 + 2 + 1 = 5

 这与最佳分割相匹配，其中两组都可以构建长前缀，但仅存在 2 的一个副本。 

### 示例 2

 输入：```
3
0 1 2
```| x| 碳纳米管[x] | 贡献 |
 | ---| ---| ---|
 | 0 | 1 | 1 |
 | 1 | 1 | 1 |
 | 2 | 1 | 1 |
 | 3 | 0 | 停止|

 总计 = 3

 这对应于一组较早停止，而另一组继续，但由于每个值都是单副本，因此两个链都会竞争，并且总和受到可用元素的限制。 

这些痕迹表明，该算法有效地计算了我们可以“支付”沿数轴同时扩展 mex(A) 和 mex(B) 的次数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每次测试 O(max Ai) | 扫描频率数组一次直到100 |
 | 空间| O(最大 Ai) | 频率数组存储 |

 约束上限为 100，n 为 100，因此这种线性扫描在时间和内存方面都很重要。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        cnt = [0] * 105
        for x in a:
            cnt[x] += 1
        ans = 0
        for x in range(105):
            if cnt[x] == 0:
                break
            ans += min(2, cnt[x])
        out.append(str(ans))
    return "\n".join(out)

# provided samples
assert run("""4
6
0 2 1 5 0 1
3
0 1 2
4
0 2 0 1
6
1 2 3 4 5 6
""") == """5
3
4
0"""

# custom cases
assert run("""1
1
0
""") == "1", "single element"

assert run("""1
2
0 0
""") == "2", "duplicate zero"

assert run("""1
5
0 0 1 1 2
""") == "5", "balanced duplicates"

assert run("""1
3
1 2 3
""") == "0", "missing zero stops immediately"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 0 | 1 0 1 | 最小前缀 |
 | 0 0 | 2 | 重复处理 |
 | 0 0 1 1 2 | 0 0 1 1 2 5 | 混合多重性|
 | 1 2 3 | 1 2 3 0 | 缺少零会破坏两者 |

 ## 边缘情况

 当数组根本不包含 0 时，两个 mex 值都被强制为 0，因为 A 和 B 都无法开始构建有效的前缀。 该算法通过第一次迭代来处理这个问题，其中 cnt[0] == 0，立即中断并返回 0。 

当一个值只出现一次时，它会限制两个 mex 链的总组合增长。 例如，如果 cnt[0] = 1，则只有一组可以开始构建有效前缀，因此总贡献上限为 1。扫描正确地仅添加一个单元，然后隐式仅针对活动链继续。 

当所有值至少出现两次直至某个 k 时，两个 mex 值都会同步增长，直到第一个缺失的数字。 该算法为每个这样的值添加 2，反映两个集合都可以独立地包含该数字，并在前缀被破坏时精确停止。
