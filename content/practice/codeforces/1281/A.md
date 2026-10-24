---
problem: 1281A
contest_id: 1281
problem_index: A
name: "Suffix Three"
contest_name: "Codeforces Round 607 (Div. 2)"
rating: 800
tags: ["implementation"]
answer: passed_samples
verified: true
solve_time_s: 147
date: 2026-06-14
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a2da53e-aedc-83ec-a672-425fbbff0c7c
---

# CF 1281A - 后缀三

 **评分：** 800
 **标签：** 实施
 **型号：** gpt-5-3-mini
 **求解时间：** 2m 27s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a2da53e-aedc-83ec-a672-425fbbff0c7c

 ---

 ## 解决方案

 ## 问题理解

 我们得到多个独立的句子。 每个句子都是一个字符串，其中单词使用下划线而不是空格连接。 我们的任务是通过仅查看句子的结尾方式将每个句子分类为三种语言之一。 

分类规则纯粹基于后缀。 如果句子以某些固定模式结尾，我们会将其映射到语言名称。 结尾之前的句子结构根本不重要，只有最后的字符决定答案。 

限制很小：最多 30 个句子，每个句子最多 1000 个字符。 这立即告诉我们，任何检查每个字符或每个测试用例执行恒定时间后缀检查的解决方案都足够快。 在这些限制下，即使是检查每个字符串所有可能的后缀匹配的简单方法也是微不足道的，因为总工作量大约为 30,000 个字符。 

需要注意的一个微妙的边缘情况是确保我们只匹配字符串末尾的后缀，而不是意外地匹配字符串内部的后缀。 例如，在任何地方天真地搜索“po”都是错误的，因为只有结尾才重要。 另一个潜在的陷阱是后缀长度重叠。 例如，“masu”和“desu”都表示日语，因此实现必须正确检查两者，而不假设单个固定后缀长度。 

## 方法

 强力解释是扫描每个句子，并通过手动比较末尾的字符来检查它是否以任何已知后缀结尾。 对于每个字符串，我们可以通过切片和检查相等性将其与所有后缀进行比较。 由于只有四个候选后缀，因此该方法在每个测试用例中最多执行四次比较，在最坏情况下每次比较都需要 O(L)，其中 L 是后缀长度。 由于 L 以 1000 为界，这仍然非常小。 

关键的观察是我们不需要任何预处理或复杂的解析。 问题完全归结为检查字符串是否以几种固定模式之一结尾。 这意味着我们可以直接使用后缀比较操作。 输入的结构保证了一个后缀完全匹配，因此我们不需要歧义处理或优先级规则。 

从暴力到最优的转变本质上是认识到决策空间是恒定大小的。 我们没有扫描或解析，而是将每个测试用例减少为少数字符串比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（手动扫描）| O(t · L) | O(1) | O(1) | 已接受 |
 | 最佳（后缀检查）| O(t · L) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们独立处理每个句子并使用后缀检查确定其语言。 

1.读取测试用例的数量。 这定义了我们将执行多少个独立的分类操作。 
2. 对于每个句子，检查它是否以后缀“mnida”结尾。 如果是，则输出“KOREAN”。 首先进行此检查是因为它是唯一的，并且可以避免与其他后缀产生不必要的歧义。 
3. 如果不是以“mnida”结尾，请检查是否以“desu”或“masu”结尾。 如果任一条件成立，则输出“JAPANESE”。 这两个后缀属于同一语言组，因此它们使用 OR 条件进行逻辑组合。 
4. 如果以上都不匹配，则句子必须以“po”结尾，因此输出“FILIPINO”。 该问题保证每个输入都以有效后缀之一结尾，因此不需要后备验证。

在这个问题中，检查的顺序并不是严格必要的，因为后缀不会以导致歧义的方式重叠，但明确地编写它们可以保持逻辑清晰，并避免扩展规则时意外的错误分类。 

### 为什么它有效

 每个句子都保证以一组固定后缀中的一个有效后缀结尾。 由于后缀相等是一种确定性属性，因此直接检查最终字符足以唯一地标识该语言。 该算法依赖于有效句子不能在末尾匹配多个语言后缀的不变量，因此第一个匹配条件始终是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    s = input().strip()

    if s.endswith("mnida"):
        print("KOREAN")
    elif s.endswith("desu") or s.endswith("masu"):
        print("JAPANESE")
    else:
        print("FILIPINO")
```该解决方案使用Python的内置`endswith`方法，直接高效地实现后缀比较。 每次检查的运行时间与后缀长度成正比，后缀长度是恒定的且非常小。 

条件的顺序反映了后缀的逻辑分组。 首先检查韩语，因为它是一个独特的单后缀类别。 接下来使用组合 OR 条件处理日语。 Filipino 成为默认情况，因为该问题保证了后缀集的完整性。 

使用`strip()`确保换行符不会干扰后缀匹配，这是竞赛设置中常见的实现细节错误。 

## 工作示例

 我们跟踪两个代表性案例，看看后缀检测如何确定输出。 

### 示例 1

 输入：```
kamusta_po
genki_desu
```| 步骤| 字符串| 以“mnida”结尾？ | 以“desu”/“masu”结尾？ | 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 卡穆斯塔_po | 没有 | 没有 | 菲律宾 |
 | 2 | genki_desu | 没有 | 是的 | 日语 |

 第一个字符串以“po”结尾，因此它未通过所有早期检查并默认为菲律宾语。 第二个字符串与日语后缀“desu”匹配，触发第二个条件。 

### 示例 2

 输入：```
annyeong_hashimnida
si_roy_mustang_ay_namamasu
```| 步骤| 字符串| 以“mnida”结尾？ | 以“desu”/“masu”结尾？ | 输出|
 | ---| ---| ---| ---| ---|
 | 1 | Annyang_hashimnida | 是的 | - | 韩语 |
 | 2 | si_roy_mustang_ay_namamasu | si_roy_mustang_ay_namamasu | 没有 | 是的 | 日语 |

 第一句话明显匹配韩语后缀“mnida”，它立即确定输出，而不需要进一步检查。 第二个匹配“masu”，确认日语。 

这些示例证实，在给定的保证下，仅后缀匹配就足够且明确。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t · L) | 每个测试用例执行恒定数量的后缀比较，每次最多扫描字符串的最后几个字符 |
 | 空间| O(1) | O(1) | 除了输入存储之外，不使用任何其他数据结构 |

 约束允许最多 30 个长度为 1000 的字符串，因此最多执行 30,000 个字符检查，这在时间限制内是微不足道的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    t = int(input())
    out = []
    for _ in range(t):
        s = input().strip()
        if s.endswith("mnida"):
            out.append("KOREAN")
        elif s.endswith("desu") or s.endswith("masu"):
            out.append("JAPANESE")
        else:
            out.append("FILIPINO")
    return "\n".join(out)

# provided sample
assert run("""8
kamusta_po
genki_desu
ohayou_gozaimasu
annyeong_hashimnida
hajime_no_ippo
bensamu_no_sentou_houhou_ga_okama_kenpo
ang_halaman_doon_ay_sarisari_singkamasu
si_roy_mustang_ay_namamasu
""") == """FILIPINO
JAPANESE
JAPANESE
KOREAN
FILIPINO
FILIPINO
JAPANESE
JAPANESE"""

# custom: single character string edge (invalid but structurally safe)
assert run("""1
po
""") == "FILIPINO"

# custom: all Japanese variants
assert run("""2
a_desu
b_masu
""") == """JAPANESE
JAPANESE"""

# custom: Korean dominance check
assert run("""1
xmnida
""") == "KOREAN"

# custom: mixed unrelated prefix, Filipino fallback
assert run("""1
very_long_sentence_about_nothing_po
""") == "FILIPINO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`po`| 菲律宾 | 最小有效菲律宾语后缀 |
 |`a_desu / b_masu`| 日语 | 两个日语后缀变体 |
 |`xmnida`| 韩语 | 韩语后缀检测正确性 |
 | 长的`_po`句子| 菲律宾 | 后缀正确性独立于前缀 |

 ## 边缘情况

 一种边缘情况是句子非常短并且仅由后缀本身组成。 例如，输入`po`仍应正确归类为菲律宾人。 该算法自然地处理这个问题，因为`endswith("po")`即使整个字符串恰好是两个字符也是如此。 

另一个边缘情况是多个后缀模式可能作为子字符串出现在句子的前面。 例如，`po_desu_mnida_po`内部包含所有三个标记，但只有最后的后缀很重要。 该实现是正确的，因为它从不扫描整个字符串，只扫描尾部。 

最后一个边缘情况是后缀长度重叠。 自从`"desu"`和`"masu"`共享相同的语言但不同的结尾，两者都必须明确检查。 OR 条件确保两者得到同等对待，并且不会出现优先级问题，因为只有最终匹配才重要。
