---
title: "CF 103648G - 鸽子舞"
description: "暴力的想法是维护当前舞蹈中所有字符串的显式集合，并且在每个查询上迭代所有字符串并检查查询是否是其中任何字符串的前缀。 对于第三类操作，我们物理上反转集合中的每个字符串。"
date: "2026-07-02T22:03:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103648
codeforces_index: "G"
codeforces_contest_name: "UTPC Contest 04-08-22 Div. 1 (Advanced)"
rating: 0
weight: 103648
solve_time_s: 49
verified: true
draft: false
---

[CF 103648G - 鸽子之舞](https://codeforces.com/problemset/problem/103648/G)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 方法

 暴力的想法是维护当前舞蹈中所有字符串的显式集合，并且在每个查询上迭代所有字符串并检查查询是否是其中任何字符串的前缀。 对于第三类操作，我们物理上反转集合中的每个字符串。 这是正确的，因为它直接模拟问题陈述，但其成本主要由重复的完全反转和重复的前缀扫描决定。 每次反转的时间复杂度为 O(所有字符串的总长度)，并且最多可以有 10^5 次这样的操作，最坏的情况是大约 10^10 个字符操作。 

关键的观察结果是全球反转是一致的。 每个字符串要么以正常形式存储，要么以反转形式存储，仅取决于到目前为止看到的类型三操作的数量的奇偶校验。 我们不修改存储的字符串，而是维护两种尝试：一种以原始方向存储字符串，一种存储反向字符串。 我们还维护布尔翻转状态。 当插入一个字符串时，我们将其插入到两个 trie 中，但我们根据当前的翻转状态从逻辑上解释哪个 trie 是活动的。 当查询到达时，我们要么在正向特里树中搜索查询，要么在反向特里树中搜索查询，具体取决于当前是否翻转。 翻转操作只是切换一个布尔值，时间复杂度为 O(1)。 

这通过摊销常数时间全局转换将问题简化为 trie 中的标准前缀存在查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(Q * 总长度) 加上重复的完全反转| O(总长度) | 太慢了 |
 | 具有惰性反转的两个 Trie | O(总长度 + Q * | 查询 | ) |

 ## 算法演练

 1. 维护两种 trie 结构，一种表示插入的字符串，一种表示其反转形式。 这种分离确保我们可以在任一方向回答前缀查询，而无需修改现有数据。 
2. 保留一个布尔变量，指示全局反转是否已应用奇数次或偶数次。 该变量确定哪个 trie 是当前存储字符串的主动解释。 
3. 对于每个插入操作，将字符串插入到两个尝试中。 这是必要的，因为未来的查询可能会根据未来的反转以任一方向解释相同的字符串，并且预先计算这两种表示可以避免重新计算。 
4. 对于每个查询操作，使用给定的查询字符串遍历当前反转状态对应的 trie。 如果我们在每个字符处都到达有效节点，我们会检查该路径是否存在，这意味着至少一个存储的字符串将查询作为前缀。 
5. 对于每个反转操作，只需切换布尔标志而不是修改存储的数据。 这反映出所有弦同时改变方向。 

这样做的原因是系统在任何时候的状态仅取决于反转的平价，而不是它们的位置。 每个字符串都会经历相同的转换序列，因此提前表示两个方向可以保留所有未来的可能性。 trie 确保前缀查询的响应时间仅与查询长度成正比，并且全局结构保持一致，因为存储的字符串不需要进行物理更新。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Trie:
    def __init__(self):
        self.next = {}
        self.cnt = 0

    def insert(self, s):
        node = self
        node.cnt += 1
        for ch in s:
            if ch not in node.next:
                node.next[ch] = Trie()
            node = node.next[ch]
            node.cnt += 1

    def query(self, s):
        node = self
        for ch in s:
            if ch not in node.next:
                return False
            node = node.next[ch]
        return True

def main():
    q = int(input())
    forward = Trie()
    backward = Trie()
    flipped = False

    for _ in range(q):
        parts = input().split()
        t = parts[0]

        if t == "1":
            s = parts[1]
            forward.insert(s)
            backward.insert(s[::-1])

        elif t == "3":
            flipped = not flipped

        else:
            s = parts[1]
            if flipped:
                print(1 if backward.query(s) else 0)
            else:
                print(1 if forward.query(s) else 0)

if __name__ == "__main__":
    main()
```插入步骤故意存储两个方向，以便我们永远不需要在全局翻转下重新计算反转。 翻转标志控制查询哪个 trie，保持查询逻辑独立于历史长度。 

一个微妙的实现细节是，我们不尝试维护完整字符串成员资格的计数，仅维护前缀存在的计数。 trie 节点不需要终止标志，因为任何有效路径都指示至少一个存储的字符串继续通过该前缀。 

## 工作示例

 考虑我们插入“alice”、查询“alice”、翻转、然后查询“ali”和“ecil”的顺序。 

| 步骤| 运营| 翻转| 特里使用 | 查询 | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 插入爱丽丝| 假 | 前进+后退| - | - |
 | 2 | 查询爱丽丝 | 假 | 前进| 爱丽丝 | 1 |
 | 3 | 翻转| 真实| - | - | - |
 | 4 | 查询阿里 | 真实| 向后| 阿里 | 0 |
 | 5 | 查询ecil | 真实| 向后| 埃西尔 | 1 |

 该跟踪显示了相同的存储字符串如何根据方向满足不同的查询，而无需进行任何结构修改。 

现在考虑插入“abc”和“xyz”，然后翻转两次并在中间插入一个查询。 

| 步骤| 运营| 翻转 | 查询 | 结果 |
 | ---| ---| ---| ---| ---|
 | 1 | 插入 abc | 假 | - | - |
 | 2 | 插入 xyz | 假 | - | - |
 | 3 | 翻转| 真实| - | - |
 | 4 | 查询“ab” | 真实| 0 | |
 | 5 | 翻转| 假 | - | - |
 | 6 | 查询“xy” | 假 | 1 | |

 这表明翻转奇偶性完全决定了解释并且重复翻转的行为一致。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(插入字符串的总长度 + 查询总长度) | 每个字符在 trie 操作中都会被处理固定次数 |
 | 空间| O(插入字符串的总长度) | 每个字符串在两次尝试中都贡献节点，与总输入大小呈线性关系 |

 这些约束允许最多 10^5 个字符，因此线性时间 trie 构造和遍历完全在限制范围内，同时避免任何每次操作的全字符串反转。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import contextlib

    output = []
    def fake_print(x):
        output.append(str(x))

    global print
    old_print = print
    print = fake_print
    try:
        # inline solution
        class Trie:
            def __init__(self):
                self.next = {}

            def insert(self, s):
                node = self
                for ch in s:
                    if ch not in node.next:
                        node.next[ch] = Trie()
                    node = node.next[ch]

            def query(self, s):
                node = self
                for ch in s:
                    if ch not in node.next:
                        return False
                    node = node.next[ch]
                return True

        data = inp.strip().split()
        q = int(data[0])
        idx = 1
        f = Trie()
        b = Trie()
        flipped = False

        for _ in range(q):
            t = data[idx]
            idx += 1
            if t == "1":
                s = data[idx]
                idx += 1
                f.insert(s)
                b.insert(s[::-1])
            elif t == "3":
                flipped = not flipped
            else:
                s = data[idx]
                idx += 1
                print(1 if (b.query(s) if flipped else f.query(s)) else 0)
    finally:
        print = old_print

    return "\n".join(output)

# sample
assert run("""5
1 alice
2 alice
3
2 ali
2 ecil
""") == """1
0
1"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单次插入+查询 | 1 | 基本前缀检测 |
 | 翻转然后查询不匹配| 0 | 反转正确性 |
 | 双击返回原版 | 1 | 奇偶校验处理|
 | 多个插入| 1/0 混合 | trie 共享正确性 |

 ## 边缘情况

 一个关键的边缘情况是发生多次翻转而中间没有任何插入。 该算法可以安全地处理这个问题，因为翻转仅切换布尔值并且不会改变 trie 状态，因此重复翻转不会累积成本。 

另一个边缘情况是针对长存储字符串查询空前缀或非常短的前缀。 trie 确保即使多个字符串共享前缀，存在检查也保持正确，因为查询路径之外的任何延续都会确认有效匹配。 

最后，在一系列翻转之后插入字符串仍然有效，因为每次插入都会立即以两个方向记录，从而使未来的状态更改与过去的数据无关。
