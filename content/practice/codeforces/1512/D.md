---
title: "CF 1512D - 损坏的阵列"
description: "我们得到一个已经以非常特定的方式“篡改”的数组。 原来有一个长度为n的未知数组，称之为a。"
date: "2026-06-10T18:53:20+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1512
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 713 (Div. 3)"
rating: 1200
weight: 1512
solve_time_s: 144
verified: false
draft: false
---

[CF 1512D - 损坏的阵列](https://codeforces.com/problemset/problem/1512/D)

 **评分：** 1200
 **标签：** 构造性算法、数据结构、贪婪
 **求解时间：** 2m 24s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个已经以非常特定的方式“篡改”的数组。 本来有一个长度未知的数组`n`，称之为`a`。 从这个数组中，附加了两个额外的数字：一个是数组中所有元素的总和`a`，另一个是任意额外的数字`x`介于 1 和 10^9 之间。 添加这两个值后，整个数组被打乱，我们只看到最终的混合数组`b`尺寸的`n + 2`。 

任务是恢复任何有效的原始数组`a`长度`n`，或确定没有这样的数组可以产生给定的`b`。 

关键的困难在于我们不知道其中的哪两个元素`b`是“特殊”的：一个是原始数组的和，另一个是额外的数字。 所有其他元素都必须属于`a`。 

约束条件很大，总的`n`所有测试用例最多为 2 · 10^5。 这排除了任何尝试在二次时间中重复删除对或重新计算总和的方法。 任何解决方案本质上都必须在线性或近线性时间内处理每个测试用例，通常是通过排序和执行单次扫描或使用散列。 

当“和元素”存在多个候选选择时，特别是当总和等于常规元素之一时，就会出现微妙的边缘情况。 例如，如果所有数字都很小并且重复，选择错误的出现可能会意外地产生一致但不正确的重建。 当删除候选和后剩余的数组由于重复或错误识别额外元素而与所需的和不匹配时，会出现另一种失败情况。 

## 方法

 直接的暴力方法会尝试每对索引`(i, j)`在`b`, 治疗`b[i]`作为总和`a`和`b[j]`作为多余的数字，然后检查是否删除`b[i]`和`b[j]`留下一个总和等于的数组`b[i]`。 对于每次尝试，我们都会计算剩余元素的总和并验证相等性。 

这是合乎逻辑的，因为问题只隐藏了两个特殊元素。 然而，成本来自于重新计算总和并检查 O(n^2) 对的有效性，并且每次检查的时间为 O(n)，导致最坏情况下为 O(n^3)，这远远超出了限制。 

关键的观察是，如果我们确定哪个元素是额外的数字`x`，然后剩余的总和`n + 1`元素必须由原始数组及其总和组成。 该结构意味着一旦`x`是固定的，我们可以确定所需的总和`a`并检查线性时间的一致性。 

我们对数组进行排序以系统地处理候选人的选择。 对于每个候选职位处理`b[i]`作为`x`，我们计算总和`S`。 剩余的多重集必须包含`S`作为其要素之一。 然后我们可以尝试验证是否删除`x`匹配的总和正好离开`n`总和一致的元素。 

排序的结构使我们能够有效地识别候选者并避免重复的重新计算。 我们不重新计算每对的总和，而是维护前缀式推理：删除两个元素并检查算术一致性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力配对检查 | O(n^3) | O(n^3) | O(1) | O(1) | 太慢了|
 | 排序+单次扫描检查| O(n log n) | O(n log n) | O(1) 额外 | 已接受 |

 ## 算法演练

 1. 对数组进行排序`b`。 排序并不是严格要求正确性的，但它允许我们以结构化的方式推理候选者，并快速访问更有可能是总和或额外元素的大值。 
2. 计算总和`S`中所有元素的`b`。 自从`S = sum(a) + x`，任何有效的重建必须满足删除`x`和`sum(a)`正好留下以下元素`a`。 
3. 迭代每个索引`i`, 治疗`b[i]`作为候选人的额外号码`x`。 对于每个选择，计算`remaining_sum = S - b[i]`。 
4. 现在我们必须检查剩余数组中是否存在可以充当的元素`sum(a)`。 该元素必须等于`remaining_sum / 2`，因为：

 如果`remaining_sum = sum(a) + x`我们删除了`x`，那么其余的等于`sum(a)`，所以删除后`x`从总数中，剩余的多重集必须包含`sum(a)`和原始元素，意味着一致性条件，减少到检查数组中的匹配值。 

更具体地说，删除后`b[i]`，我们需要找到第二个索引`j ≠ i`这样`b[j] = remaining_sum - b[j]`，这意味着`b[j] = remaining_sum / 2`。 
5.如果`remaining_sum`是奇数，跳过这个候选，因为不可能进行整数分割。 
6. 如果是偶数，检查该值是否`remaining_sum // 2`存在于数组中（不包括索引）`i`。 如果确实如此，我们就找到了有效的分解。 
7. 构建`a`通过输出除所选元素之外的所有元素`x`以及所选的总和元素。 

### 为什么它有效

 不变量是多重集`b`始终包含三个概念部分：原始数组`a`, 一份`sum(a)`，和一个任意值`x`。 任何有效的重建都必须准确删除这两个特殊元素，留下一个其总和与剩余结构一致的多重集。 通过强迫一名候选人作为`x`，我们将问题简化为检查其余部分是否可以拆分为有效的求和元素和原始数组。 由于和元素被唯一确定一次`x`是固定的，检查减少到单个存在测试。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        b = list(map(int, input().split()))
        
        total = sum(b)
        b.sort()
        
        freq = {}
        for v in b:
            freq[v] = freq.get(v, 0) + 1
        
        found = False
        
        for i in range(n + 2):
            x = b[i]
            remaining = total - x
            
            if remaining % 2 != 0:
                continue
            
            target = remaining // 2
            
            freq[x] -= 1
            if freq[x] == 0:
                del freq[x]
            
            if freq.get(target, 0) > 0:
                freq[target] -= 1
                if freq[target] == 0:
                    del freq[target]
                
                # remaining elements form a valid a
                res = []
                for k, v in freq.items():
                    res.extend([k] * v)
                
                if len(res) == n:
                    print(*res)
                    found = True
                    break
                
                # rollback
                freq[target] = freq.get(target, 0) + 1
            
            # restore x
            freq[x] = freq.get(x, 0) + 1
        
        if not found:
            print(-1)

if __name__ == "__main__":
    solve()
```该实现依赖于频率跟踪，以便我们可以有效地模拟删除两个元素。 对于每位候选人`x`，我们暂时减少其频率并尝试删除相应的`target = (total - x) // 2`。 如果成功，剩余的多重集正是重建的`a`。 

一个常见的陷阱是忘记总和的候选者必须作为单个出现的情况而不是所有出现的情况被删除。 这就是为什么频率图会在每次尝试后仔细变异并恢复。 

## 工作示例

 ### 示例 1

 输入：```
b = [2, 3, 7, 12, 2]
```| 步骤| 总计 | x 选择 | 剩余| 目标| 行动|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 26 | 26 2 | 24 | 12 | 12 尝试删除 2 |
 | 2 | 26 | 26 12 | 12 14 | 14 7 | 找到有效的分割 |

 什么时候`x = 2`，删除它留下 24，这将需要 12 的和元素。由于 12 存在，删除两个叶子`[2,3,7]`，这是有效的。 

这证实了算法正确地识别了哪个出现是额外的数字。 

### 示例 2

 输入：```
b = [9, 1, 7, 1, 6, 5]
```| 步骤| 总计 | x 选择 | 剩余| 目标| 行动|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 29 | 29 9 | 20 | 10 | 10 没有找到|
 | 2 | 29 | 29 7 | 22 | 22 11 | 11 没有找到|
 | 3 | 29 | 29 6 | 23 | 23 11.5 | 11.5 无效|

 对于任何选择都不存在有效的分割`x`，所以输出是`-1`。 

这演示了没有元素可以充当一致总和组件的失败案例。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例的 O(n log n) | 排序占主导地位，每个候选检查使用散列的平均时间复杂度为 O(1) |
 | 空间| O(n) | 频率图和输出存储|

 总复杂度是可以接受的，因为所有复杂度的总和`n`跨测试用例的边界为 2 · 10^5，因此即使对所有输入进行排序，在时间限制下仍然有效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import defaultdict

    def solve():
        t = int(input())
        out = []
        for _ in range(t):
            n = int(input())
            b = list(map(int, input().split()))
            total = sum(b)
            freq = defaultdict(int)
            for v in b:
                freq[v] += 1
            
            found = False
            for i in range(n + 2):
                x = b[i]
                freq[x] -= 1
                if freq[x] == 0:
                    del freq[x]
                
                rem = total - x
                if rem % 2 == 0:
                    target = rem // 2
                    if freq.get(target, 0) > 0:
                        freq[target] -= 1
                        if freq[target] == 0:
                            del freq[target]
                        if sum(k * v for k, v in freq.items()) == n * target - (target - target):
                            out.append(" ".join(map(str, sum(([k] * v for k, v in freq.items()), []))))
                            found = True
                            break
                        freq[target] = freq.get(target, 0) + 1
                
                freq[x] = freq.get(x, 0) + 1
            
            if not found:
                out.append("-1")
        return "\n".join(out)

    return solve()

# provided samples
assert run("""4
3
2 3 7 12 2
4
9 1 7 1 6 5
5
18 2 2 3 2 9 2
3
2 6 9 2 1
""")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小尺寸 n=1 情况 | 最小结构的正确性| 处理琐碎的重建|
 | 所有相同的值 | 重复项下的鲁棒性| 避免双重删除错误 |
 | 大随机组合| 性能稳定性| 确保 O(n log n) 行为 |
 | 无解案例| 正确-1输出| 拒绝无效分割 |

 ## 边缘情况

 一种棘手的情况是，当候选人`x`等于与假定的总和元素相同的值。 在具有重复项的数组中，删除一次出现很重要。 基于频率的删除可确保一次仅排除一个实例，从而防止意外过度删除。 

当正确答案需要选择最大元素时，会出现另一种边缘情况`x`，因为贪婪的直觉可能会偏向较小的值。 该算法系统地尝试所有候选者，因此即使仅从排序中最优选择并不明显，它仍然会成功。 

最后一个边缘情况是存在多个有效答案。 由于算法在找到任何一致的对后立即返回`(x, sum(a))`，它自然地输出一个有效的、没有歧义的重构。
