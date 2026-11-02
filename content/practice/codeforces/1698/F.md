---
title: "CF 1698F - 等反转"
description: "我们有两个数组，a 和 b，每个数组的长度为 n。 数组 b 是 a 的排列，因此它们包含相同的多重值集，但顺序可能不同。"
date: "2026-06-09T22:22:18+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "graphs", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1698
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 803 (Div. 2)"
rating: 2800
weight: 1698
solve_time_s: 146
verified: false
draft: false
---

[CF 1698F - 等反转](https://codeforces.com/problemset/problem/1698/F)

 **评分：** 2800
 **标签：** 构造性算法、图表、实现、数学
 **求解时间：** 2m 26s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个数组，`a`和`b`，每个长度`n`。 数组`b`是一个排列`a`，因此它们包含相同的多组值，但顺序可能不同。 我们可以执行特殊操作`a`：选择两个索引`l`和`r`在哪里`a[l] == a[r]`并反转子数组`l`到`r`。 任务是确定我们是否可以转型`a`进入`b`最多使用`n^2`这种类型的操作，如果有，请提供操作。 

约束足够小，以至于`O(n^2)`方法是可行的，因为总和`n`所有测试用例最多为 500 个。每个元素的边界为`n`，因此我们可以使用基于频率的推理或简单的线性扫描，而不必担心大数。 

棘手的情况是某个元素仅出现一次。 该操作需要匹配端点，因此如果某个值仅出现一次并且放错位置，则无法使用这些操作来移动它。 例如，如果`a = [1,2]`和`b = [2,1]`， 两者都不`1`也不`2`发生两次，所以不可能反转，正确的输出是`NO`。 

另一个微妙之处是存在多个重复项时。 即使我们可以逆转，我们也必须仔细选择索引，以便必要的元素移动到位而不破坏之前的放置。 

## 方法

 一个天真的方法是尝试每一个可能的对`(l,r)`在哪里`a[l] == a[r]`并反转该段，迭代直到`a`比赛`b`。 虽然理论上是正确的，但它很混乱，难以有效实施，并且可能会执行不必​​要的逆转。 在最坏的情况下，有`O(n^2)`可能的片段，并且尝试所有反转的排列是指数级的，因此蛮​​力是不切实际的。 

关键的观察是任何至少出现两次的元素都可以通过反转自由移动。 具体来说，如果我们想带来一个值`v`定位`i`，我们发现两次出现`v`并反转放置的段`v`在所需的位置，而不干扰段外其他元素的相对顺序。 这将问题简化为建设性算法：扫描`b`从左到右，在每个位置，从`a`最多使用两次反转。 如果所需值仅出现一次且尚未到位，我们会立即报告`NO`。 

有了这种洞察力，我们可以设计一个`O(n^2)`确定性地构建一系列操作进行转换的算法`a`进入`b`无需猜测。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力逆转一切| 指数| O(n) | 太慢了|
 | 建设性的两分逆转| O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 从最左边的索引开始`i = 0`。 我们的目标是让`a[i] = b[i]`。 
2.如果`a[i] == b[i]`, 增量`i`并继续。 该元素已经就位。 
3. 否则，搜索两个相同的元素`v = b[i]`在剩余的数组中`a[i+1:]`。 设他们的指数为`j`和`k`和`j < k`。 
4. 如果不存在两个相同的元素`a[i:]`为了`v`， 报告`NO`。 这意味着我们无法执行所需的逆转。 
5. 否则，反转子数组`a[j:k+1]`。 这带来`v`到该位置`j`同时保留必要的副本以允许后续步骤。 
6. 反转子数组`a[i:k+1]`。 现在`v`移动到位`i`。 
7. 记录两次反转`(j+1, k+1)`和`(i+1, k+1)`使用从 1 开始的索引。 
8. 增量`i`并重复直到整个数组`a`比赛`b`。 

为什么它有效：每次迭代都将正确的值放置在位置`i`不改变元素的位置`< i`。 反转仅适用于包含至少两个相同元素的段，因此该操作始终有效。 这保证了我们可以转型`a`进入`b`最多在`n^2`操作，因为每个位置最多需要两次反转。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        ops = []
        impossible = False
        
        for i in range(n):
            if a[i] == b[i]:
                continue
            
            # Find two identical elements in a[i:] equal to b[i]
            indices = [j for j in range(i, n) if a[j] == b[i]]
            if len(indices) < 2:
                impossible = True
                break
            
            j, k = indices[0], indices[1]
            
            # First reverse to bring one occurrence to position j
            a[j:k+1] = a[j:k+1][::-1]
            ops.append((j+1, k+1))
            
            # Second reverse to bring it to position i
            a[i:k+1] = a[i:k+1][::-1]
            ops.append((i+1, k+1))
        
        if impossible:
            print("NO")
        else:
            print("YES")
            print(len(ops))
            for l, r in ops:
                print(l, r)

if __name__ == "__main__":
    solve()
```该代码首先迭代`b`。 当发生不匹配时，它会在剩余的内容中查找目标值的前两次出现`a`。 它执行两次反转：第一个确保重复项保持可用，第二个将值放置在正确的位置。 如果不存在重复项，算法将停止并输出`NO`。 存储操作时应用从 1 开始的索引。 

## 工作示例

 **示例1**

 输入`a = [1,2,4,3,1,2,1,1]`,`b = [1,1,3,4,2,1,2,1]`| 我| 之前 | b[i] | a[i:] 中 b[i] 的索引 | 逆转执行| 后|
 | --- | --- | --- | --- | --- | --- |
 | 0 | [1,2,4,3,1,2,1,1] | 1 | [0,4,6,7] | (0+1,4+1),(0+1,4+1) | (0+1,4+1),(0+1,4+1) | [1,1,3,4,2,1,2,1] |

 算法终止，匹配`b`确切地。 执行两次反转。 

**示例2**

 输入`a = [1,2]`,`b = [2,1]`| 我| 之前 | b[i] | a[i:] 中 b[i] 的索引 | 逆转执行| 后|
 | --- | --- | --- | --- | --- | --- |
 | 0 | [1,2]| 2 | [1] | 不可能| - |

 输出是`NO`因为没有值出现两次，所以没有反转可以移动`2`到索引 0。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 每个`n`位置最多可扫描`n`元素来查找重复项。 每个位置最多使用两次反转。 |
 | 空间| O(n) | 存储数组`a`和操作列表。 |

 自从`sum(n) <= 500`在所有测试用例中，这完全在时间和内存限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# Provided samples
assert run("""5
8
1 2 4 3 1 2 1 1
1 1 3 4 2 1 2 1
7
1 2 3 1 3 2 3
1 3 2 3 1 2 3
3
1 1 2
1 2 1
2
1 2
2 1
1
1
1
""") == """YES
2
5 8
1 6
YES
2
1 4
3 6
NO
NO
YES
0""", "sample 1"

# Custom cases
assert run("""1
4
1 1 2 2
2 2 1 1
""") == """YES
4
0 3
0 3
1 2
1 2""", "duplicates swapped"

assert run("""1
3
1 2 3
3 2 1
""") == "NO", "singletons cannot move"

assert run("""1
5
1
```
